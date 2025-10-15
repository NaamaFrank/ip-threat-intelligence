# IP Threat Intelligence Dashboard

A modern web application for analyzing IP addresses using multiple threat intelligence providers. Built with React (frontend) and Node.js/Express (backend).

## Features

- **Multi-Provider Intelligence**: Integrates with AbuseIPDB and IPQualityScore APIs
- **Risk Assessment**: Automated risk scoring (Low, Medium, High) based on multiple factors
- **Real-time Analysis**: Fast IP address validation and threat assessment
- **Search History**: Caches recent searches with localStorage persistence
- **Modern UI**: Cybersecurity-themed dark interface with smooth animations
- **Comprehensive Testing**: Unit tests for both frontend and backend components

## Prerequisites

- Node.js 18+ 
- npm 
- API keys from threat intelligence providers (see Configuration section)

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/NaamaFrank/ip-threat-intelligence.git

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory with your API keys:

```bash
# Copy the template
cp server/.env.example server/.env

# Edit the .env file with your actual API keys
```

### 3. API Key Configuration

#### AbuseIPDB Setup
1. Visit [AbuseIPDB](https://www.abuseipdb.com/api)
2. Create a free account
3. Generate an API key
4. Add to your `.env` file: `ABUSEIPDB_API_KEY=your_key_here`

#### IPQualityScore Setup  
1. Visit [IPQualityScore](https://www.ipqualityscore.com/create-account)
2. Create a free account
3. Get your API key from the dashboard
4. Add to your `.env` file: `IPQS_API_KEY=your_key_here`

### 4. Running the Application

#### Development Mode

Start both server and client in development mode:

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001`

## Testing

### Backend Tests
```bash
cd server
npm test
```

Tests include:
- IP validation logic
- Risk calculation algorithms
- API integration functions
- Service layer unit tests

### Frontend Tests
```bash
cd client
npm test
```

Tests cover:
- Context state management
- Component rendering
- User interactions
- Error handling

## Risk Assessment Logic

The application calculates risk levels based on:

1. **Abuse Score**: Historical abuse reports
2. **Recent Activity**: Recent malicious reports  
3. **VPN/Proxy Detection**: Anonymous network usage
4. **Geolocation**: Country-based risk factors

Risk levels are categorized as:
- 🟢 **Low**: Minimal threat indicators
- 🟠 **Medium**: Some concerning factors
- 🔴 **High**: Multiple threat indicators

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify keys are correctly set in `.env`
   - Check API key validity on provider websites
   - Ensure no extra spaces or quotes in `.env`

2. **CORS Issues**
   - Server runs on port 3001 by default
   - Client expects API at `http://localhost:3001`

3. **Build Failures**
   - Ensure Node.js 18+ is installed
   - Clear `node_modules` and reinstall if needed
   - Check for TypeScript compilation errors
