// components/features/PostCard.tsx
"use client";

import Image from "next/image";
import type { Platform, Status } from "@/lib/state";
import { cn } from "@/lib/utils";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, CalendarCheck, CheckCircle2 } from "lucide-react";

type Props = {
    id: string;
    day: string;
    time?: string;
    dateISO?: string;
    caption: string;
    hashtags: string[];
    imageUrl: string;
    status: Status;
    platform: Platform;

    locked?: boolean;
    onToggleLock?: (id: string) => void;
    onApprove?: (id: string) => void;
};

const statusClass: Record<Status, string> = {
    DRAFT: "bg-amber-100 text-amber-800",
    SCHEDULED: "bg-blue-100 text-blue-800",
    PUBLISHED: "bg-emerald-100 text-emerald-800",
};

export default function PostCard({
    id,
    day,
    time,
    dateISO,
    caption,
    hashtags,
    imageUrl,
    status,
    platform,
    locked,
    onToggleLock,
    onApprove,
}: Props) {
    return (
        <Card
            className={cn(
                "overflow-hidden transition-shadow",
                locked ? "ring-2 ring-amber-400 shadow-md" : "shadow-sm"
            )}
        >
            {/* Header row: day/time/date + status + lock */}
            <CardHeader className="py-3 flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">{day}</Badge>
                    {time && <Badge variant="outline">{time}</Badge>}
                    {dateISO && <Badge variant="outline">{dateISO}</Badge>}
                    <Badge className={cn(statusClass[status])}>{status}</Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">{platform}</Badge>
                    {status === "DRAFT" && (
                        <Button
                            size="icon"
                            variant="ghost"
                            aria-label={locked ? "Unlock post" : "Lock post"}
                            title={locked ? "Unlock post" : "Lock post"}
                            onClick={() => onToggleLock?.(id)}
                        >
                            {locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </CardHeader>

            {/* Image */}
            <div className="relative w-full h-44">
                <Image
                    src={imageUrl}
                    alt={caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                />
            </div>

            {/* Body */}
            <CardContent className="pt-4">
                <CardTitle className="text-base font-medium mb-2 line-clamp-2">
                    {caption}
                </CardTitle>

                <div className="flex flex-wrap gap-1 mb-4">
                    {hashtags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-500">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {status === "DRAFT" && (
                        <Button size="sm" onClick={() => onApprove?.(id)}>
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                    )}
                    {status === "SCHEDULED" && (
                        <Button size="sm" variant="secondary" disabled>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Scheduled
                        </Button>
                    )}
                    {status === "PUBLISHED" && (
                        <Button size="sm" variant="secondary" disabled>
                            Published
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}