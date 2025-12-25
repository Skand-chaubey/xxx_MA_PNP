# PowerNetPro Implementation Plan & Next Steps

## ✅ Completed Fixes

### 1. User Session Persistence - **FIXED**
- ✅ Added `restoreSession()` function in `authStore.ts`
- ✅ Session now persists using Supabase session + SecureStore fallback
- ✅ User data stored in SecureStore for offline access
- ✅ Session restoration on app startup in `App.tsx`
- ✅ Loading screen while checking session

### 2. Default Location (Pune) - **FIXED**
- ✅ Set default location as Pune (18.5204, 73.8567) in MarketplaceScreen
- ✅ Falls back to Pune if location permission denied or error occurs
- ✅ User can still use GPS location if permission granted

### 3. Withdraw Option - **COMPLETED**
- ✅ Created `WithdrawScreen.tsx` with premium UI
- ✅ Bank account details form (Account Number, IFSC, Holder Name)
- ✅ Quick amount selection
- ✅ Balance validation
- ✅ Added to navigation stack
- ✅ Ready for backend API integration

### 4. Mapbox Integration Status - **PARTIAL**

**Current Status:**
- ❌ Mapbox is NOT fully integrated
- ✅ `@rnmapbox/maps` package is installed in `package.json`
- ❌ Map view shows placeholder text
- ❌ No Mapbox access token configured

**What's Missing:**
1. Mapbox access token configuration
2. Map component implementation
3. Seller pins on map
4. Cluster view for multiple sellers
5. Map interaction handlers

**Next Steps for Mapbox:**
1. Get Mapbox access token from https://account.mapbox.com/
2. Add token to `.env` file: `MAPBOX_ACCESS_TOKEN=your_token_here`
3. Configure in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "mapboxAccessToken": "your_token_here"
       }
     }
   }
   ```
4. Implement MapView component in MarketplaceScreen
5. Add seller markers with custom pins
6. Implement clustering for nearby sellers

## 📋 Further Steps & Recommendations

### Phase 1: Core Functionality (Priority: High)

1. **Backend API Integration**
   - [ ] Connect withdrawal API endpoint
   - [ ] Connect top-up payment gateway (Razorpay/PhonePe)
   - [ ] Implement real-time energy data sync
   - [ ] Connect trading/marketplace APIs

2. **Mapbox Integration** (Priority: Medium)
   - [ ] Get Mapbox access token
   - [ ] Implement MapView component
   - [ ] Add seller markers
   - [ ] Implement clustering
   - [ ] Add map filters

3. **Testing**
   - [ ] Test session persistence across app restarts
   - [ ] Test withdrawal flow
   - [ ] Test location services
   - [ ] Test offline functionality

### Phase 2: Enhanced Features (Priority: Medium)

1. **Energy Meter Simulation** (See plan below)
2. **Real-time Updates**
   - WebSocket integration for live energy data
   - Push notifications for trades
3. **Advanced Analytics**
   - Energy consumption patterns
   - Trading history analytics
   - Carbon footprint tracking

### Phase 3: Production Readiness (Priority: Low)

1. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Lazy loading
2. **Security**
   - API key encryption
   - Secure storage audit
   - Penetration testing
3. **Documentation**
   - API documentation
   - User guide
   - Developer documentation

## 🔌 Fake Energy Meter Simulation Plan

### Overview
To test the app without real hardware, we need to simulate energy meter data. This will generate realistic energy generation and consumption data.

### Implementation Strategy

#### Option 1: Mock Data Service (Recommended for Development)

**Location:** `src/services/mock/meterSimulator.ts`

**Features:**
- Generate realistic 15-minute interval data
- Simulate solar generation patterns (peak during day, zero at night)
- Simulate consumption patterns (higher during peak hours)
- Configurable parameters:
  - Solar panel capacity (kW)
  - Daily generation target (kWh)
  - Consumption patterns
  - Weather variations

**Implementation:**

```typescript
// src/services/mock/meterSimulator.ts
export class MeterSimulator {
  private solarCapacity: number; // kW
  private dailyTarget: number; // kWh
  
  generateEnergyData(startDate: Date, endDate: Date): EnergyData[] {
    // Generate 15-min interval data
    // Simulate solar generation based on time of day
    // Simulate consumption patterns
    // Return array of EnergyData
  }
  
  private calculateSolarGeneration(timestamp: Date): number {
    // Calculate based on:
    // - Time of day (solar curve)
    // - Random weather variations
    // - Panel capacity
  }
  
  private calculateConsumption(timestamp: Date): number {
    // Calculate based on:
    // - Time of day (peak hours)
    // - Random variations
    // - Base load
  }
}
```

#### Option 2: Backend Mock API

**Features:**
- Create mock API endpoints that return simulated data
- Can be used for both development and testing
- Easier to switch to real API later

**Endpoints:**
- `GET /api/meters/{meterId}/energy-data?start={timestamp}&end={timestamp}`
- `GET /api/meters/{meterId}/current-generation`
- `GET /api/meters/{meterId}/daily-yield`

#### Option 3: Supabase Database Functions

**Features:**
- Use PostgreSQL functions to generate data
- Store in database for persistence
- Can be triggered on schedule

**Implementation:**
```sql
-- Create function to generate energy data
CREATE OR REPLACE FUNCTION generate_mock_energy_data(
  meter_id UUID,
  start_time TIMESTAMP,
  end_time TIMESTAMP
) RETURNS TABLE(...) AS $$
BEGIN
  -- Generate 15-min interval data
  -- Insert into energy_data table
END;
$$ LANGUAGE plpgsql;
```

### Recommended Approach

**For Development: Use Option 1 (Mock Data Service)**

**Advantages:**
- ✅ No backend dependency
- ✅ Fast iteration
- ✅ Easy to test different scenarios
- ✅ Works offline

**Implementation Steps:**

1. **Create Meter Simulator Service**
   ```typescript
   // src/services/mock/meterSimulator.ts
   ```

2. **Add Configuration**
   ```typescript
   // src/utils/constants.ts
   export const MOCK_METER_CONFIG = {
     solarCapacity: 5, // kW
     dailyTarget: 25, // kWh
     baseConsumption: 0.5, // kW
     peakConsumption: 2.0, // kW
   };
   ```

3. **Integrate with Meter Store**
   ```typescript
   // In meterStore.ts or meterService.ts
   if (__DEV__ || useMockData) {
     const simulator = new MeterSimulator();
     const data = simulator.generateEnergyData(start, end);
     return data;
   }
   ```

4. **Add Toggle in Settings**
   - Allow users to enable/disable mock data
   - Useful for demos and testing

### Data Patterns to Simulate

1. **Solar Generation:**
   - Peak: 10 AM - 3 PM
   - Curve: Bell-shaped during day
   - Zero: Night time (6 PM - 6 AM)
   - Weather variations: ±20% random

2. **Consumption:**
   - Base load: 0.5 kW (24/7)
   - Peak hours: 6 AM - 9 AM, 6 PM - 10 PM
   - Random variations: ±30%

3. **Net Energy:**
   - Generation - Consumption
   - Positive = Excess (can sell)
   - Negative = Deficit (need to buy)

### Example Data Structure

```typescript
interface SimulatedEnergyData {
  timestamp: Date;
  generation: number; // kW
  consumption: number; // kW
  net: number; // kW (generation - consumption)
  batteryLevel?: number; // % (if battery exists)
}
```

### Testing Scenarios

1. **Normal Day:**
   - Good generation during day
   - Excess energy to sell
   - Normal consumption

2. **Cloudy Day:**
   - Reduced generation (50-70%)
   - May need to buy energy
   - Higher consumption

3. **Peak Consumption:**
   - High consumption during evening
   - May exceed generation
   - Need to buy from grid

4. **Zero Generation:**
   - Night time or equipment failure
   - All energy from grid/battery
   - No selling possible

## 🚀 Quick Start Guide

### To Enable Mock Energy Data:

1. Create `src/services/mock/meterSimulator.ts`
2. Add `useMockData: true` flag in config
3. Integrate with `meterService.ts`
4. Test with different scenarios

### To Complete Mapbox Integration:

1. Sign up at https://account.mapbox.com/
2. Get access token
3. Add to `.env`: `MAPBOX_ACCESS_TOKEN=your_token`
4. Update `MarketplaceScreen.tsx` to use MapView
5. Add seller markers

### To Test Session Persistence:

1. Sign in to app
2. Close app completely
3. Reopen app
4. Should remain signed in

## 📝 Notes

- All fixes are backward compatible
- Mock data can be easily disabled for production
- Mapbox integration is optional but recommended for better UX
- Session persistence uses Supabase as primary source, SecureStore as fallback

