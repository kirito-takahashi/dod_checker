"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Lightbulb } from "lucide-react";

interface InsightsProps {
    corporate: Record<string, number>;
    employee: Record<string, number>;
}

interface DimensionGap {
    dimension: string;
    corporate: number;
    employee: number;
    gap: number; // corporate - employee (positive => employees feel it less than stated)
}

export default function Insights({ corporate, employee }: InsightsProps) {
    // Compute the gap per dimension between stated values and perceived reality.
    const gaps: DimensionGap[] = Object.keys(corporate).map((dim) => ({
        dimension: dim,
        corporate: corporate[dim],
        employee: employee[dim] ?? 0,
        gap: corporate[dim] - (employee[dim] ?? 0),
    }));

    // Largest positive gap = dimension companies talk up most but employees feel least.
    const sortedByGap = [...gaps].sort((a, b) => b.gap - a.gap);
    const biggestGap = sortedByGap[0];
    // Most aligned = smallest absolute gap.
    const mostAligned = [...gaps].sort(
        (a, b) => Math.abs(a.gap) - Math.abs(b.gap)
    )[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg h-full"
        >
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-amber-400" />
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                    Key Insights
                </h3>
            </div>

            <div className="space-y-4">
                {biggestGap && (
                    <div className="flex items-start gap-3">
                        <TrendingDown
                            size={20}
                            className="text-red-500 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-zinc-300">
                            The widest gap is in{" "}
                            <span className="font-semibold text-white">
                                {biggestGap.dimension}
                            </span>
                            : leadership emphasizes it (
                            {biggestGap.corporate.toFixed(2)}) far more than
                            employees experience it (
                            {biggestGap.employee.toFixed(2)}).
                        </p>
                    </div>
                )}

                {mostAligned && (
                    <div className="flex items-start gap-3">
                        <TrendingUp
                            size={20}
                            className="text-green-500 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-zinc-300">
                            <span className="font-semibold text-white">
                                {mostAligned.dimension}
                            </span>{" "}
                            is the most aligned dimension — stated values and
                            employee perception are within{" "}
                            {Math.abs(mostAligned.gap).toFixed(2)} of each other.
                        </p>
                    </div>
                )}
            </div>

            <p className="text-xs text-zinc-500 mt-4">
                Insights compare corporate messaging against averaged employee
                sentiment per cultural dimension.
            </p>
        </motion.div>
    );
}
