"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";
import ScoreCard from "@/components/ScoreCard";
import CultureRadar from "@/components/CultureRadar";
import SemanticMap from "@/components/SemanticMap";
import Insights from "@/components/Insights";

const API_URL = "http://127.0.0.1:8000";

interface AnalysisResult {
    company: string;
    gap_score: number;
    dimensions: {
        corporate: Record<string, number>;
        employee: Record<string, number>;
    };
    umap_coords: Array<{ x: number; y: number; text: string; label: string }>;
}

export default function Home() {
    const [companies, setCompanies] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [data, setData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`${API_URL}/companies`);
            setCompanies(res.data);
            if (res.data.length > 0) setSelectedCompany(res.data[0]);
        } catch (err) {
            console.error(err);
            setError("Failed to load companies. Is backend running?");
        }
    };

    const handleAnalyze = async () => {
        if (!selectedCompany) return;
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${API_URL}/analyze`, {
                company_name: selectedCompany
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Culture Gap Visualizer
                </h1>
                <p className="text-zinc-500 mt-2">Quantifying the dissonance between stated values and employee reality.</p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                <div className="relative">
                    <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="appearance-none bg-zinc-900 border border-zinc-700 text-white py-3 px-6 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[200px]"
                    >
                        {companies.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !selectedCompany}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                    Analyze Alignment
                </button>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg mb-8 text-center">
                    {error}
                </div>
            )}

            {/* Dashboard Grid */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Score Card - Spans full width on small, or primary spot */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <ScoreCard score={data.gap_score} />
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                        <Insights corporate={data.dimensions.corporate} employee={data.dimensions.employee} />
                    </div>

                    <div className="md:col-span-1">
                        <CultureRadar corporate={data.dimensions.corporate} employee={data.dimensions.employee} />
                    </div>

                    <div className="md:col-span-1">
                        <SemanticMap points={data.umap_coords} />
                    </div>
                </div>
            )}

            {!data && !loading && !error && (
                <div className="text-center text-zinc-600 mt-20">
                    <p>Select a company and click Analyze to begin.</p>
                </div>
            )}
        </div>
    );
}
