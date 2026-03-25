import type { ComponentType } from "react";
import PlaceholderTemplate from "./PlaceholderTemplate";

// Flyers
import AdmissionFlyer from "@/templates/flyers/AdmissionFlyer";
import AnnualDayFlyer from "@/templates/flyers/AnnualDayFlyer";
import SummerCampFlyer from "@/templates/flyers/SummerCampFlyer";
import OpenHouseInvite from "@/templates/flyers/OpenHouseInvite";

// Brochures
import SchoolBrochure from "@/templates/brochures/SchoolBrochure";
import FeeStructureCard from "@/templates/brochures/FeeStructureCard";

// Instagram Posts
import AdmissionsOpen from "@/templates/instagram/AdmissionsOpen";
import WhyKidsPlanet from "@/templates/instagram/WhyKidsPlanet";
import ParentReviews from "@/templates/instagram/ParentReviews";
import LimitedSeats from "@/templates/instagram/LimitedSeats";
import FounderStory from "@/templates/instagram/FounderStory";
import AchievementSpotlight from "@/templates/instagram/AchievementSpotlight";
import FestivalGreeting from "@/templates/instagram/FestivalGreeting";

// Instagram Stories
import AdmissionStory from "@/templates/stories/AdmissionStory";
import DayInLife from "@/templates/stories/DayInLife";
import NewBatchAnnouncement from "@/templates/stories/NewBatchAnnouncement";
import EventHighlight from "@/templates/stories/EventHighlight";

// WhatsApp Creatives
import AdmissionInquiryReply from "@/templates/whatsapp/AdmissionInquiryReply";
import FeeReminder from "@/templates/whatsapp/FeeReminder";
import HolidayNotice from "@/templates/whatsapp/HolidayNotice";
import EventInvite from "@/templates/whatsapp/EventInvite";

// Banners
import FacebookCover from "@/templates/banners/FacebookCover";
import WebsiteHeroBanner from "@/templates/banners/WebsiteHeroBanner";

export interface TemplateProps {
  fields: Record<string, string>;
}

const registry: Record<string, ComponentType<TemplateProps>> = {
  // Flyers
  "admission-flyer": AdmissionFlyer,
  "annual-day-flyer": AnnualDayFlyer,
  "summer-camp-flyer": SummerCampFlyer,
  "open-house-invite": OpenHouseInvite,

  // Brochures
  "school-brochure": SchoolBrochure,
  "fee-structure-card": FeeStructureCard,

  // Instagram Posts
  "ig-admissions-open": AdmissionsOpen,
  "ig-why-kids-planet": WhyKidsPlanet,
  "ig-parent-reviews": ParentReviews,
  "ig-limited-seats": LimitedSeats,
  "ig-founder-story": FounderStory,
  "ig-achievement": AchievementSpotlight,
  "ig-festival": FestivalGreeting,

  // Instagram Stories
  "story-admission": AdmissionStory,
  "story-day-in-life": DayInLife,
  "story-new-batch": NewBatchAnnouncement,
  "story-event-highlight": EventHighlight,

  // WhatsApp Creatives
  "wa-admission-reply": AdmissionInquiryReply,
  "wa-fee-reminder": FeeReminder,
  "wa-holiday-notice": HolidayNotice,
  "wa-event-invite": EventInvite,

  // Banners
  "banner-facebook-cover": FacebookCover,
  "banner-website-hero": WebsiteHeroBanner,
};

export function getTemplateComponent(templateId: string): ComponentType<TemplateProps> {
  return registry[templateId] || PlaceholderTemplate;
}

export function registerTemplate(id: string, component: ComponentType<TemplateProps>) {
  registry[id] = component;
}
