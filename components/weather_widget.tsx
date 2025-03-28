"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import { text } from "stream/consumers";

interface WeatherData {
    temperature: number;
    description : string;
    location : string;
    unit: string;
}

export default function Weatherwidget (){
    const[Location , setLocation ]= useState<string>("");
    const [weather, setWeather]= useState<WeatherData | null>(null);
    const [error, setError] = useState<string| null>(null);
    const [isLoading, setIsLoading]= useState<boolean>(false);

    const handleSearch = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = Location.trim();
        if(trimmedLocation === ""){
            setError("please enter a valid location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("city not found.")
            };
            const data = await response.json();
            const weatherData : WeatherData ={
                temperature : data.current.temp_c,
                description: data.current.condition.text,
                location : data.location.name,
                unit : "c",
            };
            setWeather(weatherData);
        }catch(error){
           setError("the city not found. Please try again");
           setWeather(null);
        }finally{
            setIsLoading(false);
        }
    };
    function getTemperatureMessage(temperature : number , unit : string) : string {
        if(unit == "c"){
            if(temperature < 0){
                return ` it is freezing at ${temperature}°C! bundle up!`
            }else if (temperature < 10){
                return `it is quite cold out at ${temperature}°C. Wear warm clothes`
            }else if(temperature < 20){
                return `it is pretty cold at ${temperature}°C. light jacket is suitable for weather`
            }else(temperature < 30);{
                return `todays weather is pleasant at ${temperature}°C. ENJOY THE WEATHER!`
            }
        }else{
            return `${temperature}°${unit}`
        }
    }
    function getWeatherMessage(description: string): string {
        switch (description.toLowerCase()) {
          case "sunny":
            return "It's a beautiful sunny day!";
          case "partly cloudy":
            return "Expect some clouds and sunshine.";
          case "cloudy":
            return "It's cloudy today.";
          case "overcast":
            return "The sky is overcast.";
          case "rain":
            return "Don't forget your umbrella! It's raining.";
          case "thunderstorm":
            return "Thunderstorms are expected today.";
          case "snow":
            return "Bundle up! It's snowing.";
          case "mist":
            return "It's misty outside.";
          case "fog":
            return "Be careful, there's fog outside.";
          default:
            return description; // Default to returning the description as-is
        }
      }
    
      function getLocationMessage(location: string): string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6; // Determine if it's night time
    
        return ` ${location} ${isNight ? "at Night" : "During the Day"}`;
      }
return(
    <div className="flex justify-center items-center h-screen">
        <Card className = "w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle> weather_widget</CardTitle>
                <CardDescription> 
                    search for the current weather condition in your city
                </CardDescription>
            </CardHeader>
            <CardContent> 
                 <form onSubmit={handleSearch} className="flex items-center gap-2"> <Input
            type = "text"
            placeholder="enter your city name"
           onChange={(e) => setLocation(e.target.value)}
            />
             <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
            </Button>
            </form>
            
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {weather && (
            <div className="mt-4 grid gap-2">
              {/* Display temperature message with icon */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTemperatureMessage(weather.temperature, weather.unit)}
                </div>
              </div>
              {/* Display weather description message with icon */}
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              {/* Display location message with icon */}
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
            </CardContent> 
        </Card>
    </div>
)
}