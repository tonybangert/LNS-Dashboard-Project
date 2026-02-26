# Legal Notice Intelligence Dashboard

Interactive dashboard for monitoring and triaging legal notice workflows. Built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
├── data/
│   ├── noticeexport.xls       # Original source data
│   └── notices.json            # Compressed JSON (generated from XLS)
├── src/
│   ├── main.jsx                # Entry point
│   ├── App.jsx                 # Main dashboard component
│   ├── DetailPanel.jsx         # Slide-out detail panel for individual notices
│   ├── data.js                 # Data loader, config, and utility functions
│   └── styles.css              # All styles
├── index.html
├── vite.config.js
└── package.json
```

## Architecture & Design Decisions

### Data Flow
- Source XLS is converted to compressed JSON (`data/notices.json`) with short field keys to reduce bundle size
- `src/data.js` expands compressed keys back to full field names at import time
- All filtering, sorting, and aggregation happens client-side via React `useMemo`

### Dashboard Hierarchy
1. **Status Tiles** — Top-level entry point. Clickable cards grouped by severity:
   - 🔴 Critical: Received (needs assignment)
   - 🟡 Warning: On Hold, Canceled (needs attention)
   - 🔵 Info: 1st–5th Run Verified (in progress)
   - 🟢 OK: Placed, Completed (healthy)

2. **Alert Banner** — Surfaces notices where Certificate of Mailing is required but not uploaded

3. **Filtered Table** — Sortable, paginated, searchable. Click any row for detail panel.

4. **Detail Panel** — Slide-out with full case info, publication run timeline, financials, compliance status

5. **Summary Cards** — Top counties and firms for current filter context

### Flags & Alerts
- **Cert Missing**: `CertificateOfMailingRequired === 'yes'` AND `CertificateOfMailingUploaded === 'no'`
- **$0 Amount**: `InitialRunAmt === 0` for non-Received/non-Canceled notices

### Status Configuration
Edit `STATUS_CONFIG` in `src/data.js` to adjust severity levels, display order, or descriptions.

## Future Enhancements (Production Roadmap)
- [ ] API integration (replace static JSON with live data endpoint)
- [ ] Aging alerts (flag notices in Received/On Hold > X days)
- [ ] Export filtered results to CSV
- [ ] User authentication and role-based views
- [ ] Real-time WebSocket updates
- [ ] County map visualization
- [ ] Notification system for new alerts
