# Instagram Analytics Visualization Studio

## Overview

The Instagram Analytics Visualization Studio is an interactive data analysis interface that combines conversational AI with dynamic data visualization. Users can select Instagram data categories (Posts, Likes, Comments) and ask questions to generate specific chart types and tables.

## Features

### 🎯 Step-Based Data Selection
- **Instagram Posts**: Analyze post engagement, reach, and performance metrics
- **Instagram Likes**: Track likes patterns, trends, and user engagement  
- **Instagram Comments**: Analyze comment sentiment, frequency, and interactions

### 📊 Dynamic Chart Generation
- **Table View**: Comprehensive data tables with Instagram-specific metrics
- **Bar Chart**: Compare data across categories and time periods
- **Pie Chart**: Show distribution and proportions (e.g., post types, sentiment)
- **Line Chart**: Display trends and patterns over time

### 🤖 Intelligent Query Processing
Users can ask natural language questions like:
- "Show me a table" → Generates data table
- "Create a pie chart" → Generates pie chart visualization  
- "Make a bar chart" → Generates bar chart
- "Show trends over time" → Generates line chart

## Components

### 1. InstagramStepsSidebar.svelte
**Step-based navigation interface:**
- Visual step progression (1, 2, 3)
- Category icons and descriptions
- Completion indicators
- Interactive step selection
- Usage instructions
- Reset functionality

### 2. ChatBox.svelte (Enhanced)
**Intelligent chat interface:**
- Context-aware responses based on selected step
- Dynamic placeholder text
- Step validation (prevents queries without selection)
- Suggested prompts for each data category
- Chart type detection from user queries
- Step indicator display

### 3. VisualizationPanel.svelte (Enhanced)
**Advanced visualization display:**
- **Dynamic Chart Type Detection**: Analyzes user queries to determine visualization type
- **Instagram-Specific Data**: Tailored datasets for Posts, Likes, and Comments
- **Multiple Chart Types**: Bar, Pie, Line charts with proper rendering
- **Contextual Tables**: Different column structures for each data category
- **Export Functionality**: CSV/JSON export with category-specific filenames

### 4. VisualizationInterface.svelte (Updated)
**Main coordinator:**
- Step-based state management
- Message and visualization coordination
- Responsive design with mobile optimization
- Dynamic header with step indicators

## Data Categories

### 📸 Instagram Posts
**Metrics Include:**
- Post Type (Photo, Video, Carousel, Reel, Story)
- Time Slot analysis
- Likes, Comments, Shares
- Reach and Engagement rates
- Performance tracking

### ❤️ Instagram Likes  
**Metrics Include:**
- Demographic breakdowns (age groups)
- Geographic distribution
- Peak engagement hours
- Weekly patterns
- Growth rates and trends

### 💬 Instagram Comments
**Metrics Include:**
- Sentiment analysis (Positive, Neutral, Negative)
- Language distribution
- Comment frequency and word count
- Response rates
- Top keywords and engagement metrics

## Chart Type Detection

### Automatic Detection Logic:
```javascript
// Table View
"show me a table", "display data", "list results"

// Pie Chart  
"pie chart", "round chart", "circle chart", "donut chart"

// Line Chart
"line chart", "trends over time", "show trends"

// Bar Chart (Default)
"bar chart", "compare", "analysis"
```

## Usage Flow

### 1. Step Selection
User clicks on one of three Instagram data categories:
- Posts → Enables post-related queries
- Likes → Enables likes-related queries  
- Comments → Enables comments-related queries

### 2. Query Input
User types natural language requests:
- "Show me a table of post data"
- "Create a pie chart of sentiment"
- "Make a bar chart comparing demographics"

### 3. Visualization Generation
System automatically:
- Detects requested chart type
- Generates appropriate mock data
- Renders the visualization
- Provides contextual insights

### 4. Data Export
Users can export generated data in CSV or JSON formats with step-specific filenames.

## Mock Data Examples

### Posts Data
```javascript
{
  postType: 'Photo|Video|Carousel|Reel|Story',
  timeSlot: 'Morning|Afternoon|Evening|Night', 
  likes: 500-5500,
  comments: 10-210,
  shares: 5-105,
  reach: 1000-11000,
  engagement: 0-10%
}
```

### Likes Data
```javascript
{
  demographic: '18-24|25-34|35-44|45-54|55+',
  location: 'USA|UK|Canada|Australia|Germany|France',
  totalLikes: 100-2100,
  avgLikesPerPost: 50-550,
  peakHour: 0-23,
  weekDay: 'Mon-Sun',
  growthRate: -10% to +20%
}
```

### Comments Data  
```javascript
{
  sentiment: 'Positive|Neutral|Negative',
  language: 'English|Spanish|French|German|Italian',
  commentCount: 5-105,
  avgWordsPerComment: 5-25,
  responseRate: 0-100%,
  topKeywords: 'amazing|love|great|awesome|beautiful'
}
```

## Responsive Design

### Desktop Layout
- Sidebar: Fixed 320px width with step navigation
- Chat: 40% width with full message history
- Visualization: 60% width with charts/tables

### Mobile Layout  
- Sidebar: Overlay with backdrop
- Chat: Full width, top half of screen
- Visualization: Full width, bottom half of screen
- Touch-friendly step selection

## Technical Implementation

### State Management
- `selectedStep`: Current Instagram data category
- `lastUserQuery`: For chart type detection  
- `hasVisualizationData`: Controls panel display
- `currentMessages`: Chat conversation history

### Chart Rendering
- **Bar Charts**: SVG-based with dynamic heights and colors
- **Pie Charts**: SVG path calculations with hover effects
- **Line Charts**: Polyline rendering with data points
- **Tables**: Responsive with sticky headers and infinite scroll

### Export Features
- Dynamic filename generation: `instagram-{step}-data.{format}`
- CSV with proper headers and quoted values
- JSON with pretty formatting
- Blob URL generation for download

## Integration Ready

### API Placeholder Points
1. Replace mock data generators with real Instagram API calls
2. Add authentication for Instagram Business API
3. Implement real-time data updates
4. Add data caching and pagination
5. Include advanced analytics calculations

### Future Enhancements
- **Real-time Analytics**: Live Instagram data streaming
- **Advanced Charts**: Interactive charts with drill-down capabilities
- **Comparison Tools**: Side-by-side period comparisons
- **Report Generation**: PDF exports with insights
- **Collaboration**: Share visualizations with team members
- **Custom Metrics**: User-defined KPI tracking
- **AI Insights**: Automated pattern recognition and recommendations