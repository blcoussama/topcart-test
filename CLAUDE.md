# CLAUDE.md - TopCart Project Instructions

## 🎯 PROJECT OVERVIEW

**Project:** TopCart - Advanced Shopify Cart Modal Theme App Extension
**Goal:** Build a comprehensive UpCart clone with theme compatibility across all Shopify themes
**Your Role:** Implementation specialist and memory keeper

## 🔄 DUAL-CLAUDE WORKFLOW

### **Claude in VS Code (Claude Code) Role:**

- Shopify MCP server queries and documentation fetching
- Theme compatibility research and analysis  
- Complex architecture decisions and planning
- Project knowledge searches and context management
- Handles large token responses better

### **Your Role (Implementation & Memory Keeper)**

- Direct code editing and file modifications using Claude Code's native capabilities
- Real-time debugging and testing with Shopify CLI
- Terminal operations and development commands
- **CRITICAL:** Use Claude Code's native memory features to maintain project continuity
- Generate resume documents for Claude Desktop handoffs
- Track task progress from "START NEW TASK" to "GENERATE RESUME" commands

## 🔄 TASK WORKFLOW

### **Task Session Management:**

1. **User starts task:** "START NEW TASK: [description]"
2. **You respond:** Acknowledge task start and begin tracking with native memory
3. **During task:** Implement, test, document all progress
4. **User requests resume:** "GENERATE RESUME"
5. **You provide:** Complete resume from task start to current moment
6. **Task complete:** Ready for handoff to Claude Desktop

### **Memory Tracking:**

- **Use Claude Code's native memory command** to persistently track:
  - Task objectives and progress
  - File modifications with specific changes
  - Testing results and discoveries
  - Implementation challenges and solutions
  - Theme-specific findings and quirks

## 📋 RESUME GENERATION PROTOCOL

### **Task Start Command:**

When user says: **"START NEW TASK: [task description]"**

- **Action:** Use native memory command to start tracking this specific task
- **Reset tracking:** Begin fresh memory tracking from this point
- **Log:** Task start time and description for resume generation

### **Resume Generation Command:**

When user says: **"GENERATE RESUME"**

- **Action:** Generate comprehensive resume of ALL work done since last "START NEW TASK" command
- **Include:** Everything from task start to current moment
- **Format:** Use the resume template below
- **Prepare:** For handoff to Claude Desktop

### **Additional Resume Triggers:**

- At end of major milestones (theme integration complete, feature implemented)
- When approaching token limits in current session
- Before switching focus to a different project area
- When user explicitly requests handoff to Claude Desktop

### **Resume Format:**

```markdown
# TopCart Project Resume - [DATE]

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

## 💡 NOTES FOR CLAUDE DESKTOP
- [Specific research needs for next session]
- [MCP server queries needed]
- [Documentation to fetch]
- [Complex decisions requiring architectural input]
```

### **Implementation Instructions:**

1. **Respond to "START NEW TASK"** by using native memory to begin tracking
2. **Always maintain context** about the entire TopCart project
3. **Track all file changes** from task start with specific details about modifications
4. **Document theme-specific discoveries** (selectors, CSS overrides, special cases)
5. **Note any integration challenges** and how they were solved during the task
6. **Keep track of testing results** throughout the task period
7. **Prepare comprehensive resumes** when "GENERATE RESUME" is requested

## 🔄 HANDOFF PROTOCOL

### **When Receiving Resume from Claude Desktop:**

- Read and understand all research and architectural decisions
- Implement exactly as specified unless technical issues arise
- Document any implementation challenges or modifications needed
- Update the project memory with new progress

### **When Generating Resume for Claude Desktop:**

- Include all implementation details and testing results
- Highlight any unexpected discoveries or theme-specific quirks
- Note what research or architectural decisions are needed next
- Provide clear context for continuing the work

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

- to memorize