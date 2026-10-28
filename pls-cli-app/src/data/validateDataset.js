import {
  commands,
  ALLOWED_CATEGORIES,
  ALLOWED_ROLES,
  ALLOWED_RISK_LEVELS,
  ALLOWED_OPERATING_SYSTEMS,
  ALLOWED_SHELLS
} from './commands.js';

/**
 * Validates the entire command dataset against schema and relational constraints.
 * @returns {{ valid: boolean, totalRecords: number, errors: string[] }}
 */
export function validateCommandDataset(dataset = commands) {
  const errors = [];
  const idSet = new Set();
  const allIds = new Set(dataset.map((c) => c.id));

  // Requirement 1: Dataset size
  if (!Array.isArray(dataset) || dataset.length < 50) {
    errors.push(`Dataset must contain at least 50 records. Found: ${dataset.length}`);
  }

  dataset.forEach((cmd, index) => {
    const loc = `[Record #${index + 1} ID: "${cmd.id || 'MISSING'}"]`;

    // 1. ID check
    if (!cmd.id || typeof cmd.id !== 'string' || !/^[a-z0-9-]+$/.test(cmd.id)) {
      errors.push(`${loc} Invalid id format. Must be a kebab-case string.`);
    } else if (idSet.has(cmd.id)) {
      errors.push(`${loc} Duplicate ID found: "${cmd.id}"`);
    } else {
      idSet.add(cmd.id);
    }

    // 2. Title & Descriptions
    if (!cmd.title || typeof cmd.title !== 'string' || cmd.title.length < 5) {
      errors.push(`${loc} Title must be at least 5 characters.`);
    }
    if (!cmd.taskDescription || typeof cmd.taskDescription !== 'string' || cmd.taskDescription.length < 10) {
      errors.push(`${loc} taskDescription must be at least 10 characters.`);
    }
    if (!cmd.command || typeof cmd.command !== 'string' || cmd.command.length < 2) {
      errors.push(`${loc} command must be a non-empty canonical executable string.`);
    }
    if (!cmd.explanation || typeof cmd.explanation !== 'string' || cmd.explanation.length < 10) {
      errors.push(`${loc} explanation must be at least 10 characters.`);
    }

    // 3. Category
    if (!ALLOWED_CATEGORIES.includes(cmd.category)) {
      errors.push(`${loc} Invalid category "${cmd.category}". Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }

    // 4. Roles
    if (!Array.isArray(cmd.roles) || cmd.roles.length === 0) {
      errors.push(`${loc} roles must be a non-empty array.`);
    } else {
      cmd.roles.forEach((role) => {
        if (!ALLOWED_ROLES.includes(role)) {
          errors.push(`${loc} Unknown role "${role}".`);
        }
      });
    }

    // 5. Supported OS & Shells
    if (!Array.isArray(cmd.supportedOperatingSystems) || cmd.supportedOperatingSystems.length === 0) {
      errors.push(`${loc} supportedOperatingSystems must be a non-empty array.`);
    } else {
      cmd.supportedOperatingSystems.forEach((os) => {
        if (!ALLOWED_OPERATING_SYSTEMS.includes(os)) {
          errors.push(`${loc} Unknown OS "${os}". Allowed: ${ALLOWED_OPERATING_SYSTEMS.join(', ')}`);
        }
      });
    }

    if (!Array.isArray(cmd.supportedShells) || cmd.supportedShells.length === 0) {
      errors.push(`${loc} supportedShells must be a non-empty array.`);
    } else {
      cmd.supportedShells.forEach((shell) => {
        if (!ALLOWED_SHELLS.includes(shell)) {
          errors.push(`${loc} Unknown shell "${shell}". Allowed: ${ALLOWED_SHELLS.join(', ')}`);
        }
      });
    }

    // 6. Tags
    if (!Array.isArray(cmd.tags) || cmd.tags.length === 0) {
      errors.push(`${loc} tags must be an array with at least one tag.`);
    }

    // 7. Risk Level
    if (!ALLOWED_RISK_LEVELS.includes(cmd.riskLevel)) {
      errors.push(`${loc} Invalid riskLevel "${cmd.riskLevel}". Allowed: ${ALLOWED_RISK_LEVELS.join(', ')}`);
    }
    if (!cmd.safetyNotes || typeof cmd.safetyNotes !== 'string') {
      errors.push(`${loc} safetyNotes must be a descriptive string.`);
    }

    // 8. Example
    if (!cmd.example || typeof cmd.example !== 'object') {
      errors.push(`${loc} example must be an object with scenario, commandWithArgs, and expectedOutput.`);
    } else {
      if (!cmd.example.scenario) errors.push(`${loc} example.scenario is required.`);
      if (!cmd.example.commandWithArgs) errors.push(`${loc} example.commandWithArgs is required.`);
      if (!cmd.example.expectedOutput) errors.push(`${loc} example.expectedOutput is required.`);
    }

    // 9. Relational Integrity: relatedCommandIds
    if (!Array.isArray(cmd.relatedCommandIds)) {
      errors.push(`${loc} relatedCommandIds must be an array.`);
    } else {
      cmd.relatedCommandIds.forEach((relId) => {
        if (!allIds.has(relId)) {
          errors.push(`${loc} Broken relatedCommandId reference: "${relId}" does not exist in dataset.`);
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    totalRecords: dataset.length,
    errors
  };
}

// Self-executing runner if executed directly via Node
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('validateDataset.js')) {
  const result = validateCommandDataset();
  if (result.valid) {
    console.log(`\x1b[32m✔ Validation Passed: ${result.totalRecords} production command records strictly validated with 0 errors.\x1b[0m`);
    process.exit(0);
  } else {
    console.error(`\x1b[31m✖ Validation Failed with ${result.errors.length} errors:\x1b[0m`);
    result.errors.forEach((err) => console.error(` - ${err}`));
    process.exit(1);
  }
}

