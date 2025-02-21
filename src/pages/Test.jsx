export default function Test() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <CardPost />
      <CardPost />
      <CardPost />
      <div className="flex items-center gap-1">
        <CustomCircularProgress
          value={30}
          size={60}
          strokeWidth={6}
          showLabel
          labelClassName="text-[10px] font-bold"
          renderLabel={(progress) => `${progress}%`}
          className="stroke-primary/25"
          progressClassName="stroke-primary"
        />
      </div>
      <AccordionContainedDemo />
      <NavLink to={`/flutter-chat/:${tokenService.getLoginToken}`}>
        Flutter Chat
      </NavLink>
    </div>
  );
}

import { CustomCircularProgress } from "@/components/custom-ui/custom_circular_progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "lucide-react";

export function CardPost() {
  return (
    <Card className="w-full max-w-xl shadow-none">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/shadcn.png"
            className="h-8 w-8 rounded-full bg-secondary object-contain"
            alt=""
            height={32}
            width={32}
          />
          <div className="flex flex-col gap-0.5">
            <h6 className="text-sm leading-none font-medium">shadcn</h6>
            <span className="text-xs">@shadcn</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="pt-1 pb-2 px-6">
          <h2 className="font-bold tracking-tight">Exploring New Horizons</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Had an amazing time discovering hidden gems! 🌄 Can&apos;t wait to
            share more from this journey.{" "}
            <span className="text-blue-500">#Wanderlust</span>{" "}
            <span className="text-blue-500">#NatureLovers</span>
          </p>
        </div>
        <div className="relative aspect-video bg-muted border-y" />
      </CardContent>
      <div className="border-t border-muted" />
      <CardFooter className="flex py-2">
        <Button variant="ghost" className="w-full text-muted-foreground">
          <HeartIcon /> <span className="hidden sm:inline">Like</span>
        </Button>
        <Button variant="ghost" className="w-ful text-muted-foreground">
          <MessageCircleIcon />
          <span>3450</span>
          <span className="hidden sm:inline">Comment</span>
        </Button>
        <Button variant="ghost" className="w-full text-muted-foreground">
          <ShareIcon /> <span className="hidden sm:inline">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "react-router";
import { tokenService } from "@/services/tokenService";

const items = [
  {
    title: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    title: "Is it styled?",
    content:
      "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    title: "Is it animated?",
    content:
      "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

export function AccordionContainedDemo() {
  return (
    <Accordion type="single" collapsible className=" my-4 w-full space-y-2">
      {items.map(({ title, content }, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-none rounded-md px-4 bg-secondary"
        >
          <AccordionTrigger className="flex items-center justify-start py-0">
            <div>{title}</div>
            <div className="flex items-center gap-1">
              <CustomCircularProgress
                value={30}
                size={60}
                strokeWidth={6}
                showLabel
                labelClassName="text-[10px] font-bold"
                renderLabel={(progress) => `${progress}%`}
                className="stroke-primary/25"
                progressClassName="stroke-primary"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
