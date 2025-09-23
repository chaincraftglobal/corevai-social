// lib/mockData.ts
import type { Post } from "./state";

export const demoDrafts: Post[] = [
    {
        id: "1",
        day: "Monday",
        caption: "Start your week strong 💪 Let’s boost productivity!",
        hashtags: ["#MondayMotivation", "#Productivity"],
        imageUrl: "https://picsum.photos/seed/mon/600/400",
        status: "DRAFT",
    },
    {
        id: "2",
        day: "Tuesday",
        caption: "Consistency beats intensity 📈",
        hashtags: ["#GrowthMindset", "#Consistency"],
        imageUrl: "https://picsum.photos/seed/tue/600/400",
        status: "DRAFT",
    },
    {
        id: "3",
        day: "Wednesday",
        caption: "Mid-week check-in ✨ Stay focused.",
        hashtags: ["#Motivation", "#WednesdayWisdom"],
        imageUrl: "https://picsum.photos/seed/wed/600/400",
        status: "DRAFT",
    },
    {
        id: "4",
        day: "Thursday",
        caption: "AI tools can save you hours 🚀",
        hashtags: ["#AI", "#FutureOfWork"],
        imageUrl: "https://picsum.photos/seed/thu/600/400",
        status: "DRAFT",
    },
    {
        id: "5",
        day: "Friday",
        caption: "Celebrate small wins 🎉",
        hashtags: ["#FridayFeeling", "#Success"],
        imageUrl: "https://picsum.photos/seed/fri/600/400",
        status: "DRAFT",
    },
    {
        id: "6",
        day: "Saturday",
        caption: "Recharge and reflect 🌿",
        hashtags: ["#WeekendVibes", "#Mindfulness"],
        imageUrl: "https://picsum.photos/seed/sat/600/400",
        status: "DRAFT",
    },
    {
        id: "7",
        day: "Sunday",
        caption: "Plan ahead for success 📅",
        hashtags: ["#SundayPrep", "#Productivity"],
        imageUrl: "https://picsum.photos/seed/sun/600/400",
        status: "DRAFT",
    },
];