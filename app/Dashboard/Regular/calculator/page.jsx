"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconLeaf,
  IconGlobe,
  IconAlertCircle,
  IconCopy,
  IconCheck,
  IconBatteryCharging,
  IconPlus,
  IconMinus,
  IconCode,
} from "@tabler/icons-react";

function WebsiteCalculator() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSave, setShowSave] = useState(true);
  const [visits, setVisits] = useState(10000);
  const [counter, setCounter] = useState(1);
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const increment = () => {
    if (counter < 10000) {
      setCounter(counter * 10);
    }
  };

  const decrement = () => {
    if (counter > 1) {
      setCounter(counter / 10);
    }
  };

  useEffect(() => {
    let interval;
    if (result) {
      interval = setInterval(() => {
        setVisits((prev) => (prev < 10000 ? prev + 50 : 10000));
      }, 15);
    } else {
      setVisits(1000);
    }
    return () => clearInterval(interval);
  }, [result]);

  const getBadgeCode = () => {
    const darkBadge = `<a href="http://localhost:3000/Dashboard/Regular/calculator">
    <div style="background:#1b1b1d;display:inline-flex;align-items:center;padding:8px 16px;border-radius:9999px;gap:8px">
      <span style="color:#00e5ff">${formatCO2(
        result?.statistics?.co2?.grid?.grams
      )} of CO₂/view</span>
      <span style="color:white;font-weight:600">Website Carbon</span>
    </div>
  </a>`;

    const lightBadge = `<a href="http://localhost:3000/Dashboard/Regular/calculator">
    <div style="background:white;display:inline-flex;align-items:center;padding:8px 16px;border-radius:9999px;gap:8px;border:1px solid #e5e7eb">
      <span style="color:#0066ff">${formatCO2(
        result?.statistics?.co2?.grid?.grams
      )} of CO₂/view</span>
      <span style="color:#1b1b1d;font-weight:600">Website Carbon</span>
    </div>
  </a>`;

    return selectedTheme === "dark" ? darkBadge : lightBadge;
  };

  const copyBadgeCode = () => {
    navigator.clipboard.writeText(getBadgeCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateCarbon = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    setError(null);
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(
        `http://localhost:4000/carbon?url=${encodedUrl}`
      );
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        const response = await fetch(
          "http://localhost:4000/carbon-calculator",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }
        );

        const DetailsData = await response.json();

        console.log(DetailsData);

        setResults(DetailsData);
      }
    } catch (err) {
      setError("Failed to calculate website carbon footprint");
    } finally {
      setLoading(false);
    }
  };

  const SaveSiteDetails = async () => {
    if (!result && !results) {
      alert("Please calculate the carbon footprint first.");
      return;
    }

    if (user?._id) {
      let AllResult = {
        breakdown: results?.breakdown,
        suggestions: results?.suggestions,
        userId: user?._id,
        ...result,
      };

      setSaving(true);

      try {
        await fetch("http://localhost:4000/site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...AllResult,
          }),
        });
        setShowSave(false);
      } catch (err) {
        alert("Error saving site details: " + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const UserReponse = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });
        const UseData = await UserReponse.json();
        if (UseData?.user) {
          //console.log(UseData?.user);
          setUser(UseData?.user);
        }
      } catch (error) {
        // Silent fail
      }
    };
    fetchUser();
  }, []);

  // Helper function for rating color
  const getRatingColor = (rating) => {
    switch (rating) {
      case "A+":
        return "bg-green-lt text-green";
      case "A":
        return "bg-blue-lt text-blue";
      case "B":
        return "bg-yellow-lt text-yellow";
      case "C":
        return "bg-orange-lt text-orange";
      default:
        return "bg-red-lt text-red";
    }
  };

  // Helper function for CO2 formatting
  const formatCO2 = (grams) => {
    if (grams >= 1000000) {
      return `${(grams / 1000000)?.toFixed(2)} tonnes`;
    } else if (grams >= 1000) {
      return `${(grams / 1000)?.toFixed(2)} kg`;
    } else if (grams < 1) {
      return `${(grams * 1000)?.toFixed(2)} mg`;
    } else {
      return `${grams?.toFixed(2)} g`;
    }
  };

  return (
    <div className="container-xl py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="card shadow-sm p-0"
            style={{
              borderRadius: "10px",
              background: "#fff",
              color: "#000",
              overflow: "hidden",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div className="col-9">
                  <h2 className="mb-0 fw-bold" style={{ color: "#000" }}>
                    Website Carbon Calculator
                  </h2>
                  <div className="text-muted mb-2">
                    Calculate your website's carbon footprint
                  </div>
                </div>
                <div className="col-3 text-end sm:block hidden">
                  <div className="badge bg-green-lt d-inline-flex align-items-center p-2">
                    <IconLeaf className="icon " />
                    Eco-friendly tool
                  </div>
                </div>
              </div>
              <form className="mt-4" onSubmit={calculateCarbon}>
                <div className="input-group input-group-md mb-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-primary "
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <IconSearch className="icon me-2" />
                    )}
                    Calculate
                  </button>
                </div>
              </form>
              {error && (
                <div className="alert alert-danger mt-3">
                  <IconAlertCircle className="icon me-2" />
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {result && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  className="card shadow-xl mb-4"
                  style={{
                    borderRadius: "30px",
                    background: "#1900e1",
                    color: "#fff",
                  }}
                >
                  <div className="card-body p-4 d-flex align-items-center">
                    <div
                      className={`avatar avatar-xl me-4 d-flex align-items-center justify-content-center ${getRatingColor(
                        result?.rating
                      )}`}
                      style={{
                        width: 80,
                        height: 80,
                        fontSize: 30,
                        fontWeight: "bold",
                        borderRadius: "50%",
                        background: "#fff",
                        color: "#8ebe21",
                      }}
                    >
                      {result?.rating || "A"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="mb-1 fw-bold" style={{ color: "#fff" }}>
                        Hurrah! This web page achieves a carbon rating of{" "}
                        <span className="fw-bold">{result?.rating}</span>
                      </h3>
                      <div className="mb-1">
                        This is cleaner than{" "}
                        <span className="badge bg-cyan-lt text-cyan me-1">
                          {((result?.cleanerThan || 0) * 100)?.toFixed(0)}%
                        </span>
                        of all web pages globally.
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold" style={{ color: "#fff" }}>
                          A+
                        </span>
                        <span
                          className="progress"
                          style={{
                            height: 10,
                            width: 120,
                            background: "#fff5",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <span
                            className="progress-bar bg-success"
                            style={{
                              width: `${Math.max(
                                5,
                                100 * (result?.cleanerThan || 0)
                              )}%`,
                            }}
                          ></span>
                        </span>
                        <span style={{ color: "#fff", fontWeight: 600 }}>
                          F
                        </span>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                          }}
                          className="btn btn-light btn-sm"
                          title="Copy URL"
                        >
                          <IconCopy className="icon me-1" /> Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CO2 summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-4"
                >
                  <div className="card shadow" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center ">
                        <IconGlobe
                          className="icon me-2 text-primary"
                          size={30}
                        />
                        <span
                          className="fw-bold fs-4 px-3 py-1"
                          style={{
                            background: "rgba(0,229,255,0.13)",
                            borderRadius: 8,
                          }}
                        >
                          {formatCO2(result?.statistics?.co2?.grid?.grams)}
                        </span>
                        <span className="ms-2 mb-0 fs-5">
                          of CO₂ is produced every time someone visits this web
                          page.
                        </span>
                      </div>

                      <div className="  rounded p-4">
                        <div
                          className="d-flex 
                        align-items-center justify-content-center 
                        gap-4 mb-4"
                        >
                          <button
                            onClick={decrement}
                            className="bg-primary rounded-2 border-0 f d-flex justify-content-center align-items-center 
                             fw-bold"
                            style={{ width: 35, height: 35 }}
                            disabled={counter === 1}
                          >
                            <IconMinus className="text-white" size={18} />
                          </button>

                          <div
                            className=" px-4 py-2 rounded shadow-sm text-center"
                            style={{ minWidth: 150 }}
                          >
                            <div className="text-muted small mb-1">
                              Number of Users
                            </div>
                            <div className="fs-3 fw-bold text-primary">
                              {counter}
                            </div>
                          </div>

                          <button
                            onClick={increment}
                            className="bg-primary rounded-2 border-0 f d-flex justify-content-center align-items-center 
                             fw-bold"
                            style={{ width: 40, height: 40 }}
                            disabled={counter === 10000}
                          >
                            <IconPlus className="text-white" size={30} />
                          </button>
                        </div>

                        <div className="bg-light-lt rounded p-4 text-center">
                          <div className="text-muted mb-2">
                            Total CO₂ Emissions
                          </div>
                          <div className="fs-2 fw-bold text-primary">
                            {formatCO2(
                              counter * result?.statistics?.co2?.grid?.grams
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Energy summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-4"
                >
                  <div className="card shadow" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center ">
                        <IconBatteryCharging
                          className="icon me-2 text-green"
                          size={30}
                        />
                        <span className="fs-5 fw-bold">
                          This web page appears to be running on{" "}
                          <span className="badge bg-green-lt text-green fs-5">
                            sustainable energy
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-4"
                >
                  <div className="card shadow" style={{ borderRadius: 20 }}>
                    <div className="card-body p-4">
                      <h3 className="mb-4 fw-bold">
                        Add this badge to your website
                      </h3>

                      <div className="mb-4">
                        <div className="d-flex gap-3 mb-3">
                          <button
                            className={`btn ${
                              selectedTheme === "dark"
                                ? "btn-dark"
                                : "btn-outline-dark"
                            }`}
                            onClick={() => setSelectedTheme("dark")}
                          >
                            Dark theme
                          </button>
                          <button
                            className={`btn ${
                              selectedTheme === "light"
                                ? "btn-dark"
                                : "btn-outline-dark"
                            }`}
                            onClick={() => setSelectedTheme("light")}
                          >
                            Light theme
                          </button>
                        </div>

                        <div className="p-4 bg-light rounded-3 mb-3">
                          <div className="">
                            {selectedTheme === "dark" ? (
                              <div className="bg-dark d-inline-flex align-items-center px-4 py-2 rounded-pill gap-2">
                                <span className="text-cyan">
                                  {formatCO2(
                                    result?.statistics?.co2?.grid?.grams
                                  )}{" "}
                                  of CO₂/view
                                </span>
                                <span className="text-white fw-semibold">
                                  Website Carbon
                                </span>
                              </div>
                            ) : (
                              <div className="bg-white d-inline-flex align-items-center px-4 py-2 rounded-pill gap-2 border">
                                <span className="text-primary">
                                  {formatCO2(
                                    result?.statistics?.co2?.grid?.grams
                                  )}{" "}
                                  of CO₂/view
                                </span>
                                <span className="text-dark fw-semibold">
                                  Website Carbon
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={copyBadgeCode}
                          >
                            {copied ? (
                              <IconCheck size={18} />
                            ) : (
                              <IconCode size={18} />
                            )}
                            {copied ? "Copied!" : "Copy badge code"}
                          </button>
                        </div>
                      </div>

                      <div className="alert alert-info mb-0 d-flex align-items-center gap-2">
                        <IconAlertCircle size={20} />
                        <span>
                          Add this code to your website's footer or any other
                          location where you want to display the badge.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {showSave && (
                  <button
                    className="btn btn-success mt-4 float-end"
                    onClick={SaveSiteDetails}
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <IconCheck className="icon me-2" />
                    )}
                    Save to my dashboard
                  </button>
                )}

                {!showSave && (
                  <div className="alert alert-success mt-4 mb-0">
                    Site carbon data saved!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteCalculator;
