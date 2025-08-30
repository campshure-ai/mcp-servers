import { createServer } from "@modelcontextprotocol/sdk";

// Weather API configuration
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
if (!WEATHER_API_KEY) {
  console.error("❌ WEATHER_API_KEY environment variable is required");
  console.error("Get your free API key from: https://openweathermap.org/api");
  process.exit(1);
}

const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Types for weather data
interface WeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_direction: number;
  weather_condition: string;
  description: string;
  icon: string;
  timestamp: string;
}

interface ForecastData {
  location: string;
  forecasts: Array<{
    date: string;
    temperature_high: number;
    temperature_low: number;
    weather_condition: string;
    description: string;
    humidity: number;
    wind_speed: number;
    precipitation_probability: number;
    icon: string;
  }>;
}

// Helper function to fetch weather data
async function fetchWeatherData(endpoint: string): Promise<any> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your WEATHER_API_KEY environment variable.");
    }
    if (response.status === 404) {
      throw new Error("Location not found. Please check the location name and try again.");
    }
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Helper function to get coordinates from location name
async function getCoordinates(location: string): Promise<{ lat: number; lon: number }> {
  const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${WEATHER_API_KEY}`;
  const data = await fetchWeatherData(geocodeUrl);

  if (!data || data.length === 0) {
    throw new Error(`Location not found: ${location}. Try using format: "City, Country" (e.g., "New York, US")`);
  }

  return { lat: data[0].lat, lon: data[0].lon };
}

// Weather tool handlers
async function getCurrentWeather(location: string, units = "metric"): Promise<WeatherData> {
  const currentWeatherUrl = `${WEATHER_API_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=${units}`;
  const data = await fetchWeatherData(currentWeatherUrl);

  return {
    location: `${data.name}, ${data.sys.country}`,
    temperature: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
    wind_speed: Math.round(data.wind.speed * 10) / 10,
    wind_direction: data.wind.deg || 0,
    weather_condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: new Date().toISOString(),
  };
}

async function getWeatherForecast(location: string, days = 5, units = "metric"): Promise<ForecastData> {
  const forecastUrl = `${WEATHER_API_BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=${units}&cnt=${Math.min(days * 8, 40)}`; // 8 forecasts per day (3-hour intervals)
  const data = await fetchWeatherData(forecastUrl);

  // Group forecasts by date and get daily summaries
  const dailyForecasts: { [key: string]: any[] } = {};

  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0]; // Extract date part
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });

  const forecasts = Object.entries(dailyForecasts)
    .slice(0, days)
    .map(([date, dayData]) => {
      const temps = dayData.map(item => item.main.temp);
      const conditions = dayData.map(item => item.weather[0]);
      const humidity = Math.round(dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length);
      const windSpeed = Math.round(dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length * 10) / 10;
      const precipitation = Math.round(dayData.reduce((sum, item) => sum + (item.pop || 0), 0) / dayData.length * 100);

      return {
        date,
        temperature_high: Math.round(Math.max(...temps)),
        temperature_low: Math.round(Math.min(...temps)),
        weather_condition: conditions[Math.floor(conditions.length / 2)].main,
        description: conditions[Math.floor(conditions.length / 2)].description,
        humidity,
        wind_speed: windSpeed,
        precipitation_probability: precipitation,
        icon: conditions[Math.floor(conditions.length / 2)].icon,
      };
    });

  return {
    location: `${data.city.name}, ${data.city.country}`,
    forecasts,
  };
}

async function getWeatherAlerts(location: string): Promise<any> {
  try {
    const coords = await getCoordinates(location);
    const alertsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_API_KEY}&exclude=minutely,hourly,daily`;
    const data = await fetchWeatherData(alertsUrl);

    return {
      location,
      alerts: data.alerts || [],
      hasAlerts: (data.alerts || []).length > 0,
    };
  } catch (error) {
    // If One Call API is not available, return no alerts
    return {
      location,
      alerts: [],
      hasAlerts: false,
      note: "Weather alerts require One Call API subscription (free tier doesn't include alerts)",
    };
  }
}

async function main() {
  const server = createServer({
    name: "mcp-weather-server",
    version: "1.0.0",
  });

  // Register weather tools
  server.tool("get_current_weather", "Get current weather conditions for a location", {
    location: {
      type: "string",
      description: "City name, state/country (e.g., 'New York, NY' or 'London, UK')",
      required: true,
    },
    units: {
      type: "string",
      description: "Temperature units: metric (Celsius), imperial (Fahrenheit), or kelvin",
      enum: ["metric", "imperial", "kelvin"],
      default: "metric",
    },
  }, async ({ location, units = "metric" }) => {
    try {
      const weather = await getCurrentWeather(location, units);

      const unitSymbol = units === "metric" ? "°C" : units === "imperial" ? "°F" : "K";
      const windUnit = units === "metric" ? "m/s" : "mph";

      return {
        content: [
          {
            type: "text",
            text: `🌤️ **Current Weather in ${weather.location}**

🌡️  **Temperature:** ${weather.temperature}${unitSymbol} (feels like ${weather.feels_like}${unitSymbol})
🌤️  **Condition:** ${weather.weather_condition} - ${weather.description}
💧 **Humidity:** ${weather.humidity}%
🌬️  **Wind:** ${weather.wind_speed} ${windUnit} from ${weather.wind_direction}°
🔍 **Visibility:** ${weather.visibility} km
📊 **Pressure:** ${weather.pressure} hPa

*Last updated: ${new Date(weather.timestamp).toLocaleString()}*`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting current weather: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("get_weather_forecast", "Get weather forecast for upcoming days", {
    location: {
      type: "string",
      description: "City name, state/country (e.g., 'New York, NY' or 'London, UK')",
      required: true,
    },
    days: {
      type: "number",
      description: "Number of days to forecast (1-5)",
      minimum: 1,
      maximum: 5,
      default: 5,
    },
    units: {
      type: "string",
      description: "Temperature units: metric (Celsius), imperial (Fahrenheit), or kelvin",
      enum: ["metric", "imperial", "kelvin"],
      default: "metric",
    },
  }, async ({ location, days = 5, units = "metric" }) => {
    try {
      const forecast = await getWeatherForecast(location, days, units);

      const unitSymbol = units === "metric" ? "°C" : units === "imperial" ? "°F" : "K";
      const windUnit = units === "metric" ? "m/s" : "mph";

      let forecastText = `📅 **${days}-Day Weather Forecast for ${forecast.location}**\n\n`;

      forecast.forecasts.forEach((day, index) => {
        const date = new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        });

        forecastText += `**${date}**
🌡️  High: ${day.temperature_high}${unitSymbol} | Low: ${day.temperature_low}${unitSymbol}
🌤️  ${day.weather_condition} - ${day.description}
🌧️  Rain: ${day.precipitation_probability}%
💧 Humidity: ${day.humidity}%
🌬️  Wind: ${day.wind_speed} ${windUnit}

`;
      });

      return {
        content: [
          {
            type: "text",
            text: forecastText.trim(),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting weather forecast: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  server.tool("get_weather_alerts", "Get current weather alerts and warnings for a location", {
    location: {
      type: "string",
      description: "City name, state/country (e.g., 'New York, NY' or 'London, UK')",
      required: true,
    },
  }, async ({ location }) => {
    try {
      const alerts = await getWeatherAlerts(location);

      let alertText = `🚨 **Weather Alerts for ${alerts.location}**\n\n`;

      if (!alerts.hasAlerts) {
        alertText += "✅ No active weather alerts or warnings.\n";
        if (alerts.note) {
          alertText += `\n💡 *${alerts.note}*`;
        }
      } else {
        alerts.alerts.forEach((alert: any, index: number) => {
          alertText += `🚨 **Alert ${index + 1}:** ${alert.event}\n`;
          alertText += `📅 **Valid:** ${new Date(alert.start * 1000).toLocaleString()} - ${new Date(alert.end * 1000).toLocaleString()}\n`;
          alertText += `📝 **Description:** ${alert.description}\n\n`;
        });
      }

      return {
        content: [
          {
            type: "text",
            text: alertText.trim(),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting weather alerts: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Example route for testing
  server.route("ping", async () => {
    return { message: "pong - Weather MCP Server is running! 🌤️" };
  });

  // Start the server
  await server.listen(3000);
  console.log("🌤️ Weather MCP Server running at http://localhost:3000");
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});