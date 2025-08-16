# CLAUDE.md - TopCart Project Instructions

## 🎯 PROJECT OVERVIEW

**Project:** TopCart - Advanced Shopify Cart Modal Theme App Extension
**Goal:** Build a comprehensive UpCart clone with theme compatibility across all Shopify themes
**Your Role:** Implementation specialist and memory keeper

## 🔧 PRIMARY RESPONSIBILITIES

- Direct code editing and file modifications using Claude Code capabilities
- Real-time debugging and testing with Shopify CLI
- Terminal operations and development commands
- **CRITICAL:** Maintain project continuity using TOPCART_PROJECT_MEMORY.md file
- Track task progress from "START NEW TASK" to completion

## 🔄 TASK WORKFLOW

### **Task Session Management:**

1. **User starts task:** "START NEW TASK: [description]"
2. **You respond:** Acknowledge task start and begin tracking
3. **During task:** Implement, test, document all progress in TOPCART_PROJECT_MEMORY.md
4. **Task complete:** Update memory file with results and status

### **Memory Tracking:**

- **Update TOPCART_PROJECT_MEMORY.md** with:
  - Task objectives and progress
  - File modifications with specific changes
  - Testing results and discoveries
  - Implementation challenges and solutions
  - Theme-specific findings and quirks

## 📋 PROJECT TRACKING PROTOCOL

### **Task Start Command:**

When user says: **"START NEW TASK: [task description]"**

- **Action:** Begin tracking this specific task
- **Reset tracking:** Start fresh tracking from this point
- **Log:** Task start time and description in memory file

### **Progress Documentation:**

- Update TOPCART_PROJECT_MEMORY.md throughout development
- Include implementation details and testing results
- Document any theme-specific discoveries or challenges
- Track what works and what needs improvement

### **Memory File Format:**

```markdown
# TopCart Project Memory - [DATE]

## 🎯 CURRENT STATUS
- **Last Completed:** [Specific task just finished]
- **Currently Working On:** [Active task/theme/feature]
- **Next Priority:** [What needs to be done next]

## 📁 FILES MODIFIED
- `extensions/topcart-bridge/blocks/cart-modal.liquid` - [Changes made]
- `extensions/topcart-bridge/assets/cart-modal.js` - [Changes made]  
- `extensions/topcart-bridge/assets/cart-modal.css` - [Changes made]
- [Other files and changes]

## 🎨 THEME COMPATIBILITY STATUS
### ✅ COMPLETED THEMES:
- **Dawn Theme:** [Status and specific implementation details]
- **[Other completed themes]:** [Details]

### 🔄 IN PROGRESS:
- **[Current theme]:** [What's being worked on, challenges, solutions found]

### 📋 PENDING THEMES:
- [List of themes still to tackle]

## 🔧 CURRENT IMPLEMENTATION DETAILS
### **Cart Selectors Working:**
- [List of confirmed working selectors]
- [Any theme-specific selectors discovered]

### **Override Strategies Applied:**
- [CSS overrides implemented]
- [JavaScript modifications made]

### **Issues Encountered:**
- [Any problems found and solutions applied]
- [Themes with special requirements]

## 🚀 TECHNICAL DECISIONS MADE
- [Architecture choices]
- [Code patterns established]
- [Best practices discovered]

## 📊 TESTING RESULTS
- [Which themes tested and results]
- [Performance observations]
- [Compatibility issues found/resolved]
```

### **Implementation Instructions:**

1. **Respond to "START NEW TASK"** by acknowledging and beginning task tracking
2. **Always maintain context** about the entire TopCart project
3. **Track all file changes** with specific details about modifications
4. **Document theme-specific discoveries** (selectors, CSS overrides, special cases)
5. **Note any integration challenges** and how they were solved
6. **Keep track of testing results** throughout development
7. **Update TOPCART_PROJECT_MEMORY.md** with progress and findings

## 🎯 CURRENT PROJECT FOCUS

**Phase:** Theme Integration and Compatibility
**Priority:** Ensure TopCart modal works across all major Shopify themes
**Approach:** One theme at a time, thorough testing, document findings

## 🚨 CRITICAL REMINDERS

- **Always test after implementation** using `shopify app dev`
- **Document theme-specific selectors** as you discover them
- **Maintain file organization** and consistent code patterns
- **Generate resumes proactively** to maintain continuity
- **Your memory is the project's continuity backbone** - be thorough!