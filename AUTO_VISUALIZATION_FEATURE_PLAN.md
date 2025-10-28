# Auto-Generated Multi-Visualization Feature Plan

## Overview

This document outlines a phased approach for implementing multi-visualization capabilities in the visualization page. The feature will enable users to create multiple custom prompts and eventually auto-generate visualizations using AI analysis of conversation step data.

---

## Current Architecture Analysis

### Current Flow:
1. User selects conversation step from dropdown
2. User manually selects visualization type (datatable/map/pie/bar/line)
3. User enters a single custom prompt
4. Frontend calls `executeScripter()` API with prompt
5. Backend processes and returns data (polling for results)
6. Single visualization displayed based on selected view type

### Current Limitations:
- ❌ Only one visualization at a time
- ❌ No ability to queue multiple prompts
- ❌ No auto-generation of visualizations
- ❌ Manual prompt creation required

---

## Implementation Roadmap

### **Phase 0: Multiple Custom Prompts** (Current Focus)

Enable users to create and manage multiple custom visualization prompts simultaneously.

#### User Flow:
1. User selects conversation step from dropdown
2. User clicks **"+ Add Visualization"** button
3. New prompt card appears in sidebar
4. User selects visualization type (map/table/pie/bar/line)
5. User enters custom prompt in textarea
6. User clicks **"Submit"** on individual card OR **"Generate All"** to process all prompts
7. Each card shows loading state with cancel option
8. Backend processes via scripter (polling for results)
9. Card shows completed state with **"View"** button
10. Clicking **"View"** displays visualization in main panel
11. User can add more prompt cards and repeat process

#### UI Design: Stacked Prompt Cards

```
┌─────────────────────────────────────┐
│ Selected Step: Service Data         │
│ ▼ Step 1: Facebook Marketplace      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Custom Visualizations (2)            │
│ [+ Add Visualization]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🗺️ Map Visualization          [×]   │
├─────────────────────────────────────┤
│ ○ Data Table  ● Map  ○ Pie         │
│ ○ Line Chart  ○ Bar Chart           │
├─────────────────────────────────────┤
│ [Textarea with prompt]              │
│ Show locations on map...            │
│                                     │
├─────────────────────────────────────┤
│ Status: ⏳ Processing... [Cancel]   │
│        or                           │
│ Status: ✅ Ready [View] [Refresh]   │
│        or                           │
│ Status: ❌ Failed [Retry]           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📊 Data Analysis           [×]      │
├─────────────────────────────────────┤
│ ● Data Table  ○ Map  ○ Pie         │
│ ○ Line Chart  ○ Bar Chart           │
├─────────────────────────────────────┤
│ [Textarea with prompt]              │
│ Show all records in table...        │
│                                     │
├─────────────────────────────────────┤
│ Status: ✅ Ready [View] [Refresh]   │
└─────────────────────────────────────┘

[Generate All] [Clear All]
```

#### State Management:
```javascript
// Prompt cards state
let promptCards = [
  {
    id: 'viz-1',
    title: 'Map Visualization',
    type: 'map', // datatable, map, pie, bar, line
    prompt: 'Show locations on map...',
    status: 'pending', // pending, processing, completed, failed
    sessionId: null,
    results: null,
    error: null,
    createdAt: Date.now()
  }
];

// Actions
function addPromptCard()
function removePromptCard(id)
function updatePromptCard(id, updates)
function submitPrompt(id)
function submitAllPrompts()
function cancelPrompt(id)
function retryPrompt(id)
function viewVisualization(id)
```

#### Multi-Request Handling:
```javascript
async function submitAllPrompts() {
  const pending = promptCards.filter(p => p.status === 'pending');

  // Execute all in parallel
  const promises = pending.map(card =>
    executePrompt(card.id, card.prompt, card.type)
  );

  // Track each independently
  await Promise.allSettled(promises);
}

async function executePrompt(cardId, prompt, viewType) {
  try {
    updateCardStatus(cardId, 'processing');

    // Execute scripter
    const response = await apiService.executeScripter(
      prompt, stepId, conversationId, '0'
    );

    const sessionId = response.data?.session_id;
    updateCard(cardId, { sessionId });

    // Poll for results
    const results = await pollScripterStatus(sessionId);

    updateCard(cardId, {
      status: 'completed',
      results: results
    });
  } catch (error) {
    updateCard(cardId, {
      status: 'failed',
      error: error.message
    });
  }
}
```

#### Component Structure:
```
InstagramStepsSidebar (update)
  ├─ VisualizationPromptCard (new) x N
  │   ├─ Card Header (title, remove button)
  │   ├─ Type Selector (radio buttons)
  │   ├─ Prompt Textarea
  │   ├─ Status Indicator
  │   └─ Action Buttons (Submit/View/Refresh/Retry)
  └─ Add Visualization Button

VisualizationPanel (update)
  └─ Display active visualization based on selected card
```

---

### **Phase 1: Auto-Generated Visualizations with Pusher Events**

Automatically analyze step data and generate multiple visualization options without manual prompts.

#### Backend API Integration:

**Analyze Step Endpoint:**
```bash
POST /api/v1/scripter/analyze-step
Authorization: Bearer {token}
Content-Type: multipart/form-data

result_id: "84"
conversation_id: "913"
```

**Response:**
```json
{
  "success": true,
  "message": "Visualization analysis started",
  "data": {
    "session_id": "32d45b37-5642-47a6-89ca-2dbcdedf5dbb",
    "status": "processing",
    "poll_url": "https://backend.cyberglobes.ai/api/v1/scripter/analyze-step-status/{session_id}"
  }
}
```

**Note:** We will NOT use polling for this. Instead, we'll use Pusher events.

#### Pusher Event: `VisualizationsDetected`

**Event Payload:**
```json
{
  "session_id": "32d45b37-5642-47a6-89ca-2dbcdedf5dbb",
  "visualizations": [
    {
      "type": "bar",
      "name": "Bar Chart",
      "prompt": "Given data contains list of elements...",
      "priority": 15,
      "applicable": true,
      "detected_fields": ["product.price.amount", "product.creation_time"],
      "quality_score": 100,
      "coverage": 100,
      "reason": null
    },
    {
      "type": "line",
      "name": "Line Chart",
      "prompt": "Given data contains list of elements...",
      "priority": 14,
      "applicable": true,
      "detected_fields": ["product.price.amount", "product.creation_time"],
      "quality_score": 100,
      "coverage": 100,
      "reason": null
    },
    {
      "type": "pie",
      "name": "Pie Chart",
      "prompt": "Given data contains list of elements...",
      "priority": 13,
      "applicable": true,
      "detected_fields": ["service_category"],
      "quality_score": 100,
      "coverage": 100,
      "reason": null
    },
    {
      "type": "map",
      "name": "Map Visualization",
      "prompt": "Given data contains list of elements...",
      "priority": 12,
      "applicable": true,
      "detected_fields": [
        "product.coordinates.latitude",
        "product.coordinates.longitude",
        "product.title"
      ],
      "quality_score": 100,
      "coverage": 100,
      "reason": null
    },
    {
      "type": "datatable",
      "name": "Data Table",
      "prompt": "Given data contains list of elements...",
      "priority": 11,
      "applicable": true,
      "detected_fields": [
        "product.product_id",
        "product.title",
        "product.price.amount"
      ],
      "quality_score": 100,
      "coverage": 100,
      "reason": null
    }
  ],
  "error": null,
  "metadata": {
    "total_count": 5,
    "applicable_count": 5,
    "data_record_count": 6,
    "analysis_duration_ms": 45735
  },
  "timestamp": "2025-10-05T14:48:00.000Z"
}
```

#### User Flow:
1. User selects conversation step from dropdown
2. Frontend shows "Analyzing step data..." loader in visualization panel
3. Frontend calls `POST /api/v1/scripter/analyze-step` with result_id and conversation_id
4. Backend responds instantly with session_id
5. Frontend waits for `VisualizationsDetected` pusher event
6. When event received, frontend auto-creates prompt cards for each applicable visualization
7. Frontend executes scripter requests for all visualizations **in parallel**
8. Each visualization card shows loading state
9. As results arrive (via polling), visualizations render
10. User sees complete dashboard of all auto-generated visualizations

#### Pusher Integration:
```javascript
// In VisualizationInterface.svelte
echoInstance.private(`App.Models.Conversation.${conversationId}`)
  .listen('.App\\Events\\VisualizationsDetected', (event) => {
    console.log('VisualizationsDetected event:', event);

    if (event && event.visualizations) {
      // Auto-create prompt cards from AI analysis
      const autoCards = event.visualizations
        .filter(viz => viz.applicable)
        .map(viz => ({
          id: `auto-${viz.type}-${Date.now()}`,
          title: viz.name,
          type: viz.type,
          prompt: viz.prompt,
          status: 'pending',
          isAuto: true,
          priority: viz.priority,
          qualityScore: viz.quality_score,
          detectedFields: viz.detected_fields
        }));

      // Add to prompt cards
      promptCards = [...autoCards];

      // Auto-submit all
      submitAllPrompts();
    }
  });
```

#### New API Service Method:
```javascript
// In api-service.js
async analyzeStepForVisualizations(conversationId, resultId) {
  const formData = new FormData();
  formData.append('conversation_id', conversationId);
  formData.append('result_id', resultId);

  return this.makeApiCall(
    'POST',
    '/api/v1/scripter/analyze-step',
    formData,
    'formdata'
  );
}
```

#### Mode Toggle:
Add toggle between:
- **"Auto Mode"**: Triggers AI analysis and auto-generates visualizations
- **"Manual Mode"**: Uses existing custom prompt cards from Phase 0

---

### **Phase 2: Enhanced Visualization Display**

#### Grid Layout for Multiple Visualizations:
```
┌─────────────────────────────────────────┐
│  Data Table        │  Interactive Map   │
│  [visualization]   │  [visualization]   │
├────────────────────┼────────────────────┤
│  Pie Chart         │  Bar Chart         │
│  [visualization]   │  [visualization]   │
├────────────────────┴────────────────────┤
│  Line Chart                             │
│  [visualization]                        │
└─────────────────────────────────────────┘
```

#### Features:
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Each visualization in its own card
- Expand to fullscreen modal
- Individual refresh/export buttons
- Empty state for non-applicable visualizations

---

### **Phase 3: Performance Optimization**

#### Optimization Strategies:
- Execute visualizations in parallel (Promise.allSettled)
- Limit concurrent API calls (max 3 simultaneous)
- Cache results per step (don't regenerate on revisit)
- Progressive loading (render as data arrives)
- Cancel pending requests on step change
- Debounce step selection changes (500ms)

#### Resource Management:
```javascript
// Limit concurrent executions
const concurrencyLimit = 3;
async function executeBatch(prompts) {
  for (let i = 0; i < prompts.length; i += concurrencyLimit) {
    const batch = prompts.slice(i, i + concurrencyLimit);
    await Promise.allSettled(batch.map(p => executePrompt(p)));
  }
}
```

---

## Technical Implementation Details

### API Service Methods

```javascript
// In api-service.js

/**
 * Analyze step data for visualization recommendations
 */
async analyzeStepForVisualizations(conversationId, resultId) {
  const formData = new FormData();
  formData.append('conversation_id', conversationId);
  formData.append('result_id', resultId);

  return this.makeApiCall(
    'POST',
    '/api/v1/scripter/analyze-step',
    formData,
    'formdata'
  );
}

/**
 * Execute scripter (existing method - already implemented)
 */
async executeScripter(prompt, resultId, conversationId, userId) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('result_id', resultId);
  formData.append('conversation_id', conversationId);
  formData.append('user_id', userId);

  return this.makeApiCall(
    'POST',
    '/api/v1/scripter/execute',
    formData,
    'formdata'
  );
}

/**
 * Get scripter status (existing method - already implemented)
 */
async getScripterStatus(sessionId) {
  return this.makeApiCall(
    'GET',
    `/api/v1/scripter/status/${sessionId}`
  );
}
```

---

## Component Files to Create/Modify

### Phase 0 (Multiple Custom Prompts):
- ✅ Create: `VisualizationPromptCard.svelte` (new component)
- ✅ Update: `InstagramStepsSidebar.svelte` (support multiple cards)
- ✅ Update: `VisualizationInterface.svelte` (state management)
- ✅ Update: `VisualizationPanel.svelte` (display selected visualization)

### Phase 1 (Auto-Generated):
- ✅ Update: `api-service.js` (add analyzeStepForVisualizations method)
- ✅ Update: `VisualizationInterface.svelte` (add pusher listener)
- ✅ Update: `InstagramStepsSidebar.svelte` (mode toggle, auto-trigger)
- ✅ Create: `AutoVisualizationLoader.svelte` (loading state for analysis)

### Phase 2 (Grid Layout):
- ✅ Create: `VisualizationGrid.svelte` (grid container)
- ✅ Create: `VisualizationGridCard.svelte` (individual viz card in grid)
- ✅ Update: `VisualizationPanel.svelte` (support grid mode)

---

## Success Metrics

### Phase 0:
- ✅ Users can create multiple custom prompts
- ✅ Parallel execution of multiple scripter requests
- ✅ Individual status tracking per prompt
- ✅ Ability to view different visualizations

### Phase 1:
- ✅ Auto-analysis triggers on step selection
- ✅ AI-generated prompts received via pusher
- ✅ Auto-execution of applicable visualizations
- ✅ Reduce time to first visualization by 80%

### Phase 2:
- ✅ Grid layout displays multiple visualizations simultaneously
- ✅ Users can expand/fullscreen any visualization
- ✅ Increase user engagement with multiple visualization types

---

## Technical Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Multiple parallel API calls overwhelm backend | Implement concurrency limit (max 3 simultaneous) |
| Large datasets cause timeouts | Add timeout handling and retry logic |
| Pusher event not received | Add fallback polling with timeout |
| User changes step while processing | Cancel all pending requests on step change |
| Too many prompt cards (UI clutter) | Add scrollable container with max height |

---

## Future Enhancements

- AI-generated insights/commentary for each visualization
- Smart recommendations based on data patterns
- Export all visualizations as PDF report
- Save/share visualization configurations
- Visualization templates library
- Machine learning to improve prompt generation

---

**Document Version**: 2.0
**Last Updated**: 2025-10-10
**Status**: Phase 0 - Ready to Implement
**Next Review**: After Phase 0 completion
