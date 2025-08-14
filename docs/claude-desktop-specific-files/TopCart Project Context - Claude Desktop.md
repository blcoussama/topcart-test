# TopCart Project Context - Claude Desktop

## 🎯 Project Overview

Building a complete UpCart clone for Shopify - a premium cart drawer/modal replacement with advanced features like shipping protection, subscription upgrades, express payments, and extensive customization.

## 📋 Current Status

- ✅ **Phase Complete**: Documentation analysis and technical specification  
- ✅ **MCP Integration**: Claude Desktop + Shopify Dev MCP server configured
- 🔄 **Current Phase**: Theme App Extension development
- 📁 **Master Specs**: All technical specifications in project knowledge

## 🏗️ Architecture Decisions (CRITICAL)

- **Hosting Model**: Theme App Extensions (Shopify-hosted) + Backend (developer-hosted)
- **Permissions**: Start minimal (`read_products` only), expand as needed
- **Compliance**: 2025 API compliance with instruction checking required
- **Security**: Security-first development approach throughout

## 📊 Performance & Quality Standards

- **Core Web Vitals**: All metrics must be green
- **Security**: Input validation, XSS prevention, secure API calls
- **Accessibility**: WCAG 2.1 AA compliance required
- **Error Handling**: Graceful fallbacks for all API failures

## 🚨 Critical Implementation Notes

### 2025 Compliance Requirements

```javascript
// ALWAYS check cart instructions before modifications
const hasInstructions = await checkCartInstructions();
if (!hasInstructions) {
  throw new Error('Cart operations not available');
}
```

### Shopify Policy Compliance

- ❌ **Never auto-add** paid items (Section 1.19)
- ✅ **Always require** explicit customer consent
- ✅ **Use Theme App Extensions** for UI components

### Express Payments (September 2024 Changes)

- ❌ **Cannot create** accelerated checkout buttons
- ✅ **Must detect** existing theme buttons and clone them
- ✅ **Graceful fallback** when buttons not found

## 📁 Current Project Structure

```
/
├── shopify-app/                           # Main Shopify application
│   ├── app/                               # Remix backend
│   ├── extensions/                        # Theme App Extensions  
│   ├── shopify.app.toml                   # App configuration
│   └── package.json                       # Dependencies
├── project-specs/                         # All specifications in project knowledge
└── development-notes/                     # Implementation notes
```

## 📊 Analytics System Integration

### Phase 1 Analytics (Essential)

- Basic revenue tracking (add-ons + shipping protection)
- Key metrics dashboard (impressions, conversions, checkouts)
- Simple line chart visualization
- CSV export functionality
- 30/60/90/365 day filtering

### Phase 2 Analytics (Advanced)

- Top products performance analysis
- Period comparison (vs previous period)
- Custom date ranges
- Advanced metrics (AOV, revenue per session)
- Cohort analysis

### Required API Permissions

```javascript
const analyticsPermissions = {
  phase1: ["read_products"],
  phase2: ["read_analytics", "read_orders", "read_customers"]
};
```

## 🎯 Development Roadmap

1. ✅ Set up Shopify CLI and development environment
2. ✅ Create app with permissions (`read_products`)
3. ✅ Configure MCP server integration  
4. 🔄 **CURRENT**: Initialize Theme App Extension structure
5. 🔒 Build secure cart modal foundation with 2025 compliance
6. 📊 Implement Phase 1 analytics system
7. 🚀 Build core cart features (quantity, protection, discounts)

## 🔧 Common Issues & Solutions

### Express Payments Not Working

- Check if theme has `shopify-accelerated-checkout` elements
- Use comprehensive detection strategy (multiple selectors)
- Provide theme modification guidance to merchant

### Cart API Failures

- Implement exponential backoff retry logic
- Check 2025 instruction compliance
- Graceful fallback to checkout when needed

### Permission Errors

- Start with minimal scope (`read_products`)
- Add permissions incrementally as features require
- Document all permission requirements clearly

## 🏢 Business Context

- **Company**: TopSells (new company being established)
- **First Product**: TopCart (UpCart clone with enhanced features)
- **Strategy**: Build multiple Shopify apps starting with cart replacement
- **Development Store**: "TopCart Development Store" (ready for testing)

## 🔄 Current Session Priorities

1. ✅ Verify MCP server access and capabilities
2. 🔄 **NEXT**: Generate Theme App Extension with proper structure
3. 📋 Plan cart modal foundation with 2025 compliance
4. 🔒 Implement secure cart state management

---
*This context helps maintain consistency across development sessions and provides quick access to project-specific requirements, standards, and implementation decisions for the TopCart development project.*
