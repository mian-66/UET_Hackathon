
import json
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

# Third-party dependencies
from dotenv import find_dotenv, load_dotenv
from google import genai
from google.genai import errors, types
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Confirm, Prompt
from rich.text import Text

# Ensure UTF-8 output encoding across platforms (prevents UnicodeEncodeError on Windows console)
if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding.lower() != "utf-8":
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure") and sys.stderr.encoding.lower() != "utf-8":
        sys.stderr.reconfigure(encoding="utf-8")

# Initialize Rich console
console = Console()

# Model selection: default to gemini-1.5-flash as requested, with fallback if deprecated
DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
FALLBACK_MODEL = "gemini-3.5-flash-lite"


def detect_system_context() -> dict[str, str]:
    """
    Detect the host operating system (Windows/Mac/Linux) and default shell (PowerShell/Bash).

    Returns:
        dict[str, str]: Dictionary containing normalized 'os' and 'shell' identifiers.
    """
    system_name = platform.system()

    # Normalize OS name
    if system_name == "Windows":
        os_name = "Windows"
    elif system_name == "Darwin":
        os_name = "Mac"
    elif system_name == "Linux":
        os_name = "Linux"
    else:
        os_name = system_name or "Unknown OS"

    # Detect Shell
    shell_env = os.environ.get("SHELL", "").strip()

    if "bash" in shell_env.lower():
        shell_name = "Bash"
    elif "zsh" in shell_env.lower():
        shell_name = "Zsh"
    elif os_name == "Windows":
        # On modern Windows, determine if PowerShell or CMD is default
        if "PSModulePath" in os.environ or "POWERSHELL_DISTRIBUTION_CHANNEL" in os.environ:
            shell_name = "PowerShell"
        elif "COMSPEC" in os.environ and "cmd.exe" in os.environ["COMSPEC"].lower():
            shell_name = "Command Prompt (cmd.exe)"
        else:
            shell_name = "PowerShell"
    else:
        # Default Unix fallback
        shell_name = "Bash"

    return {"os": os_name, "shell": shell_name}


def get_shell_executable(shell_name: str) -> str | None:
    """
    Determine the appropriate executable path for native shell execution.

    Args:
        shell_name: Name of the detected shell (e.g. 'PowerShell', 'Bash').

    Returns:
        str | None: Absolute path to the shell binary, or None to use default shell.
    """
    if shell_name == "PowerShell":
        return shutil.which("powershell.exe") or shutil.which("pwsh.exe")
    elif shell_name in ("Bash", "Zsh"):
        return os.environ.get("SHELL") or shutil.which("bash") or shutil.which("sh")
    return None


def init_gemini_client() -> genai.Client:
    """
    Load environment variables from .env and initialize the Google GenAI client.

    Returns:
        genai.Client: Authenticated Google GenAI SDK client.

    Raises:
        SystemExit: If GEMINI_API_KEY is not found in .env or system environment.
    """
    # Look for .env in current directory or parent directories
    dotenv_path = find_dotenv(usecwd=True)
    if not dotenv_path:
        # Also check relative to pls.py location
        script_dir_env = Path(_file_).resolve().parent / ".env"
        if script_dir_env.exists():
            dotenv_path = str(script_dir_env)

    if dotenv_path:
        load_dotenv(dotenv_path=dotenv_path)
    else:
        load_dotenv()  # Default dotenv search

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        console.print(
            "[bold red]Configuration Error:[/bold red] Missing [bold yellow]GEMINI_API_KEY[/bold yellow].\n"
            "Please ensure your [bold].env[/bold] file exists and contains:\n"
            "  GEMINI_API_KEY=your_gemini_api_key_here",
            style="red",
        )
        sys.exit(1)

    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        console.print(f"[bold red]Initialization Error:[/bold red] Failed to initialize Gemini client: {e}")
        sys.exit(1)


def generate_command(client: genai.Client, user_query: str, os_name: str, shell_name: str) -> dict[str, str]:
    """
    Call Gemini API with OS/shell context and enforce JSON output with command and explanation.

    Args:
        client: The Google GenAI client instance.
        user_query: The plain English command requested by user.
        os_name: Detected operating system name.
        shell_name: Detected shell name.

    Returns:
        dict[str, str]: Parsed dictionary with 'command' and 'explanation' keys.
    """
    system_instruction = (
        f"You are a command-line assistant running on {os_name} using {shell_name}.\n"
        f"Translate the user's natural language request into a single executable shell command tailored specifically "
        f"for {os_name} and {shell_name}.\n"
        f"Output ONLY valid JSON with exactly two keys:\n"
        f"- \"command\": the raw, single-line executable command ready to run in {shell_name} "
        f"(do NOT include markdown code blocks, backticks, or surrounding quotation marks).\n"
        f"- \"explanation\": a short, clear, 1-sentence explanation of what the command does.\n"
        f"Do not include any extra commentary, greetings, or text outside the JSON object."
    )

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        temperature=0.1,
    )

    models_to_try = [DEFAULT_MODEL]
    if FALLBACK_MODEL not in models_to_try:
        models_to_try.append(FALLBACK_MODEL)

    last_error = None
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=user_query,
                config=config,
            )

            if not response.text:
                raise ValueError("Received empty response from Gemini API.")

            result = json.loads(response.text.strip())
            if not isinstance(result, dict) or "command" not in result or "explanation" not in result:
                raise ValueError(f"JSON response is missing required keys: {response.text}")

            return {
                "command": str(result["command"]).strip(),
                "explanation": str(result["explanation"]).strip(),
            }

        except (errors.ClientError, errors.APIError) as api_err:
            last_error = api_err
            # If 404 / model not found, try fallback model seamlessly
            if "404" in str(api_err) or "not found" in str(api_err).lower():
                continue
            raise api_err
        except json.JSONDecodeError as json_err:
            raise ValueError(f"Failed to parse AI response as JSON: {json_err}") from json_err

    # If all models failed
    raise last_error if last_error else RuntimeError("Failed to generate command.")


def execute_shell_command(command: str, shell_name: str) -> None:
    """
    Execute the shell command natively using subprocess.run(..., shell=True).

    Args:
        command: The shell command string to execute.
        shell_name: The detected shell name.
    """
    console.print("\n[dim]Running command...[/dim]\n")

    # Set up shell execution parameters
    run_kwargs: dict = {"shell": True}
    shell_bin = get_shell_executable(shell_name)
    if shell_bin:
        run_kwargs["executable"] = shell_bin

    try:
        # Native shell execution as required
        completed_process = subprocess.run(command, **run_kwargs)

        if completed_process.returncode == 0:
            console.print("\n[bold green]✓ Command executed successfully.[/bold green]")
        else:
            console.print(
                f"\n[bold red]✗ Command failed with return code {completed_process.returncode}.[/bold red]"
            )

    except FileNotFoundError as fnf_err:
        console.print(f"\n[bold red]✗ Execution Error:[/bold red] Command or executable not found: {fnf_err}")
    except PermissionError as perm_err:
        console.print(f"\n[bold red]✗ Permission Denied:[/bold red] {perm_err}")
    except subprocess.SubprocessError as sub_err:
        console.print(f"\n[bold red]✗ Subprocess Error:[/bold red] {sub_err}")
    except Exception as os_err:
        console.print(f"\n[bold red]✗ OS Execution Error:[/bold red] {os_err}")


def main() -> None:
    """Entry point for the Pls CLI application."""
    try:
        # Step 1: Detect OS & Shell Context
        context = detect_system_context()
        os_name = context["os"]
        shell_name = context["shell"]

        # Step 2: Retrieve user query from command line arguments or interactive prompt
        if len(sys.argv) > 1:
            user_query = " ".join(sys.argv[1:]).strip()
        else:
            user_query = Prompt.ask("[bold cyan]pls[/bold cyan] (describe what you want to do)").strip()

        if not user_query:
            console.print("[yellow]No request provided. Operation cancelled.[/yellow]")
            return

        # Step 3: Initialize API client
        client = init_gemini_client()

        # Step 4: Generate command with loading spinner
        with console.status("[bold cyan]Translating to shell command...[/bold cyan]", spinner="dots"):
            ai_data = generate_command(client, user_query, os_name, shell_name)

        command = ai_data["command"]
        explanation = ai_data["explanation"]

        # Step 5: Format and display response
        command_panel = Panel(
            Text(command, style="bold bright_white"),
            title="[bold green]Generated Command[/bold green]",
            subtitle=f"[dim]{os_name} • {shell_name}[/dim]",
            subtitle_align="right",
            border_style="green",
            padding=(1, 2),
        )

        console.print()
        console.print(command_panel)
        console.print(f"[bold cyan]Explanation:[/bold cyan] {explanation}\n")

        # Step 6: Confirmation and safe execution
        confirmed = Confirm.ask("⚠️ Execute this command?")

        if confirmed:
            execute_shell_command(command, shell_name)
        else:
            console.print("[yellow]Operation cancelled.[/yellow]")

    except KeyboardInterrupt:
        console.print("\n[yellow]Operation cancelled by user.[/yellow]")
        sys.exit(130)
    except errors.APIError as api_err:
        console.print(f"\n[bold red]Gemini API Error:[/bold red] {api_err}")
        sys.exit(1)
    except Exception as err:
        console.print(f"\n[bold red]Error:[/bold red] {err}")
        sys.exit(1)


if _name_ == "_main_":
    main()