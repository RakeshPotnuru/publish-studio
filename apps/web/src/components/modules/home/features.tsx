import { Images } from "@/assets/images";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Rich Text Editing",
    description:
      "Get ready to jazz up your writing! Our rich text editing feature is like your personal stylist for words. It lets you add flavor, format with flair, and make your content pop! Whether you're a pro or just starting out, it's your go-to tool for crafting stories that sparkle.",
    image: Images.richTextEditing,
  },
  {
    title: "Dictation",
    description:
      "Tired of typing? Meet your new writing buddy - dictation! Just speak your mind, and let us do the typing for you. It's like chatting with a friend, but your words magically turn into polished prose. Easy, breezy, and oh-so-convenient!",
    image: Images.dictation,
  },
  {
    title: "Tone Analysis",
    description:
      "Wondering how your content vibes with your audience? Our tone analysis feature has got your back! It's like having a mood ring for your writing, helping you understand the feels behind your words. Whether you're aiming for fun and friendly or serious and sincere, we'll help you strike the right chord.",
    image: Images.toneAnalysis,
  },
  {
    title: "Import Content",
    description:
      "Got stuff scattered everywhere? No worries - our import feature brings it all together! It's like tidying up your digital closet, making sure everything's in one comfy spot. From articles to videos, just bring 'em in, and let the fun begin!",
    image: Images.importContent,
  },
  {
    title: "Generative AI",
    description:
      "Let's get creative! Our generative AI feature is like having a brainstorming buddy that never sleeps. It cooks up fresh ideas, serves 'em hot, and keeps your creative juices flowing. From catchy headlines to cool topics, it's your secret sauce for content that wows.",
    image: Images.generativeAI,
  },
];

export function Features() {
  return <StickyScroll content={content} />;
}
