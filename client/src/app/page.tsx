"use client";

import Image from "next/image";
import React, {ChangeEvent, useEffect, useState} from "react";
import {
  SunIcon,
  CloudIcon,
  BoltIcon, CloudArrowDownIcon, SparklesIcon, MoonIcon, FireIcon,
} from "@heroicons/react/24/outline";

interface WeatherData {
  city: {
    coord: string,
    lat: number,
    lon: number,
    id: number,
    country: string,
    name: string,
    population: number,
    sunrise: number,
    sunset: number,
    timezone: number
  }
  name: string;
  list: Array<{
    weather: Array<{
      description: string
      icon: string
      id: number
      main: string
    }>,
    main: {
      feels_like: number,
      grnd_level: number,
      humidity: number,
      pressure: number,
      sea_level: number,
      temp: number,
      temp_kf: number,
      temp_max: number,
      temp_min: number
    },
    wind: {
      deg: number,
      gust: number,
      speed: number
    }
  }>,
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [postcode, setPostcode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>(() => {return []});

  useEffect(() => {
    const saved = localStorage?.getItem("weatherHistory");
    if(typeof(saved) !== "undefined") {
      let result = saved ? JSON.parse(saved) : [];
      setHistory(result);
    }
  }, [])


  async function handleWeatherRequest(e: any) {
    e.preventDefault();
    setError("");
    setWeather(null);
    setSearch(true);

    if (!location.trim()) return;

    let postCodeData: any = await handlePostcodeRequest(e);
    if(postCodeData?.result) {
      let result = postCodeData.result;
      let latitude = result.latitude;
      let longitude = result.longitude;
      console.log("Postcode Data: ", latitude, longitude);
      let query = `lat=${latitude}&lon=${longitude}`;
      try {
        setLoading(true);
        const res = await fetch(
            `/api/weather?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        console.log("Data: ", data);
        if (!res.ok) throw new Error(data.error || "Failed to fetch weather");
        setWeather(data);
        setHistory((prev) => {
          const updated = [location, ...prev.filter((item) => item !== location)].slice(0, 5);
          localStorage.setItem("weatherHistory", JSON.stringify(updated));
          return updated;
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setSearch(false);
      }
    }
  }

  async function handleWeatherPostcodeClear(e: any) {
    e.preventDefault();
    setLocation("");
    setWeather(null);
    console.log("Location: ", location, e);
  }

  async function handleWeatherRecentSearchClear(e: any) {
    e.preventDefault();
    localStorage?.setItem("weatherHistory", "");
    setHistory([]);
    console.log("History: ", history, e);
  }

  async function handleWeatherLocationRequest(e: any) {
    e.preventDefault();
    setError("");
    setWeather(null);
    setSearch(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Current location:", latitude, longitude);

          try {
            const query = `lat=${latitude}&lon=${longitude}`;
            const res = await fetch(`/api/weather?query=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch weather");
            setWeather(data);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
            setSearch(false);
          }
        },
        (err) => {
          console.error(err);
          setError("Unable to retrieve your location.");
          setLoading(false);
          setSearch(false);
        }
    );
  }

  async function handlePostcodeRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPostcode(null); // rename from weather to something relevant
    if (!location.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/postcode?query=${encodeURIComponent(location)}`);
      const data = await res.json();

      console.log("Postcode data:", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch postcode data");

      setPostcode(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const handleOnLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    console.log("Event: ", e);
    console.log("Location Event: ", location);
  }

  const getWeatherIcon = (temp: number, main: string) => {
    main = main.toLowerCase();
    if (main.includes("thunderstorm"))
      return <BoltIcon className="w-16 h-16 text-gray-300" />;
    if (main.includes("rain"))
      return <CloudIcon className="w-16 h-16 text-gray-300" />;
    if (main.includes("snow"))
      return <SparklesIcon className="w-16 h-16 text-gray-300" />;
    if (main.includes("cloud"))
      return <CloudIcon className="w-16 h-16 text-gray-300" />;
    if (main.includes("clear") && temp > 20)
      return <SunIcon className="w-16 h-16 text-gray-300" />;
    if (main.includes("clear") && temp <= 20)
      return <MoonIcon className="w-16 h-16 text-gray-300" />;
    if (temp < 5)
      return <FireIcon className="w-16 h-16 text-gray-300" />;
    return <SunIcon className="w-16 h-16 text-gray-300" />;
  };

  const getDailyForecasts = (list: any[]) => {
    const daily: Record<string, any> = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
      if (
          !daily[date] ||
          Math.abs(new Date(item.dt * 1000).getHours() - 12) <
          Math.abs(new Date(daily[date].dt * 1000).getHours() - 12)
      ) {
        daily[date] = item;
      }
    });
    return Object.entries(daily).map(([date, item]) => ({ date, ...item }));
  };

  return (
      <>
        <div className="bg-stone-900" style={{width: "100%"}}>
          <div className="sm:px-6 lg:px-4" style={{width: "100%"}}>
            <div style={{height: "550px"}}
                 className="relative isolate overflow-hidden bg-stone-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-12 bg-stone-900 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:inset-ring dark:after:inset-ring-white/15 dark:after:sm:rounded-3xl">
              <h4 className="text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl">Get
                informed when the weather is changing</h4>
              <div className={"flex row"}>
                <form className="mx-auto mt-10 flex gap-x-4" style={{width: "600px"}}>
                  <label htmlFor="location" className="sr-only">Location or Postcode</label>
                  <input id="location"
                         onChange={e => handleOnLocationChange(e)}
                         value={location}
                         name="location"
                         type="text"
                         autoComplete="location"
                         required
                         className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-stone-500 sm:text-sm/6 dark:outline-white/20"
                         placeholder="Enter your postcode"/>
                  <button type="submit"
                          onClick={e => handleWeatherRequest(e)}
                          className="flex-none cursor-pointer rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
                    Search
                  </button>
                  <button type="submit"
                          onClick={e => handleWeatherPostcodeClear(e)}
                          className="flex-none cursor-pointer rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
                    Clear
                  </button>
                  <button type="submit"
                          onClick={e => handleWeatherLocationRequest(e)}
                          className="flex-none cursor-pointer rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
                    Use My Location
                  </button>
                </form>

                <div className={"flex row"}>
                  {history.length > 0 && (
                      <div className="mt-4 text-center" style={{maxHeight: "300px", overflow: "auto"}}>
                        <h3 className="text-gray-300 text-sm mb-2">Recent searches</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                          {history.map((item, index) => (
                              <button
                                  key={index}
                                  onClick={() => setLocation(item)}
                                  className="px-3 py-1 bg-stone-700 text-white rounded-full text-sm hover:bg-stone-600 transition"
                              >
                                {item}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}
                  <button type="submit"
                          onClick={e => handleWeatherRecentSearchClear(e)}
                          style={{maxHeight: "40px;", position: "relative", top: "37px", left: "20px"}}
                          className="flex-none cursor-pointer rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:shadow-none">
                    Clear Recent Searches
                  </button>
                </div>
              </div>

              {loading && (
                  <div className="mt-8 flex flex-col items-center justify-center text-white">
                    <div className="relative w-12 h-12">
                      <div className="absolute w-full h-full border-4 border-gray-700 rounded-full"></div>
                      <div className="absolute w-full h-full border-4 border-stone-300 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-300">Fetching weather data...</p>
                  </div>
              )}

              {weather ? (
                  <div className="mt-8 text-center text-white">
                    <div className={"flex column justify-center gap-x-20"}>
                      <div>
                        <h2 className="text-2xl font-semibold">
                          {weather.city.name}, {weather.city.country}
                        </h2>
                        <p className="text-lg">
                          {weather.list[0].weather[0].description
                              .split(" ")
                              .map(
                                  (w) => w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join(" ")}
                        </p>
                        <p className="text-lg">
                          Humidity: {weather.list[0].main.humidity}% RH
                        </p>
                        <p className="text-lg">
                          Wind Speed: {weather.list[0].wind.speed} Km/h
                        </p>
                        <p className="text-5xl font-bold mt-2">
                          {weather.list[0].main.temp}°C
                        </p>

                        <div className="flex justify-center mt-4">
                          {getWeatherIcon(
                              weather.list[0].main.temp,
                              weather.list[0].weather[0].main
                          )}
                        </div>
                      </div>
                      <div>
                        <div className={"flex justify-center items-center"} style={{marginBottom: "20px"}}>
                          <h2 className="text-2xl font-semibold">
                            Upcoming Weather Forecast
                          </h2>
                        </div>
                        <div className={"flex column"}>
                          {getDailyForecasts(weather.list).slice(1, 6).map((item, index) => (
                              <div
                                  key={index}
                                  style={{marginRight: "10px"}}
                                  className="gap-x-10 justify-between bg-stone-800/60 rounded-xl px-6 py-4 shadow-md hover:bg-stone-700 transition-all"
                              >
                                <p className="text-lg font-bold text-white">
                                  {new Date(item.dt * 1000).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>

                                <p className="text-lg text-gray-300">
                                  Wind Speed: {item.wind.speed.toFixed(1)} km/h
                                </p>

                                <p className="text-lg text-white font-semibold">
                                  {Math.round(item.main.temp)}°C
                                </p>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
              ) : (
                  (search && !loading) && (
                      <div className="mt-8 text-center text-white">
                        <h2 className="text-2xl font-semibold">
                          No weather data found for the postcode {'{' + location + '}'}
                        </h2>
                      </div>
                  )
              )}

            </div>
          </div>
        </div>
      </>
  );
}
