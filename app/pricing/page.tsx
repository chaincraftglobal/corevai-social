"use client"

import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
    {
        name: "Bronze",
        price: "$15",
        period: "/month",
        popular: false,
        description: "For individuals with scheduling needs.",
        features: [
            "1 Workspace",
            "1 User",
            "5 Social profiles",
            "100 AI credits",
            "10 Automation runs",
            "0 Products",
        ],
    },
    {
        name: "Silver",
        price: "$39",
        period: "/month",
        popular: false,
        description: "For small teams building their brand.",
        features: [
            "5 Workspaces",
            "5 Users",
            "20 Social profiles",
            "500 AI credits",
            "100 Automation runs",
            "10 Products",
        ],
    },
    {
        name: "Gold",
        price: "$79",
        period: "/month",
        popular: true, // highlight as most popular
        description: "Most popular — for freelancers and growing teams.",
        features: [
            "20 Workspaces",
            "20 Users",
            "50 Social profiles",
            "1,500 AI credits",
            "1,500 Automation runs",
            "100 Products",
        ],
    },
    {
        name: "Diamond",
        price: "$159",
        period: "/month",
        popular: false,
        description: "For agencies and large teams.",
        features: [
            "∞ Workspaces",
            "50 Users",
            "150 Social profiles",
            "∞ AI credits",
            "10,000 Automation runs",
            "∞ Products",
        ],
    },
]

export default function PricingPage() {
    return (
        <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
            <p className="text-slate-600 mb-12">
                Choose a plan that fits your team. All plans include a 7-day free trial.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`border rounded-lg shadow-sm flex flex-col ${plan.popular ? "border-teal-600 ring-2 ring-teal-600" : "border-slate-200"
                            }`}
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                            <p className="mt-2 text-slate-600 text-sm">{plan.description}</p>
                            <div className="mt-4 mb-6">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-slate-500 text-sm">{plan.period}</span>
                            </div>

                            <ul className="text-left space-y-2 mb-6">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-teal-600" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/dashboard"
                                className={`block text-center px-4 py-2 rounded font-medium ${plan.popular
                                        ? "bg-teal-600 text-white hover:bg-teal-700"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}