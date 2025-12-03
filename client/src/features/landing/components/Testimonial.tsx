import React from 'react';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/shadcn-io/marquee';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ img, name, username, body }) => (
  <figure
    className={cn(
      'relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6 flex flex-col',
      'border-border bg-card hover:bg-muted/50 transition-all duration-300 shadow-sm hover:shadow-md'
    )}
  >
    <div className="flex items-center gap-3 mb-4">
      <img src={img} loading="lazy" alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold">{name}</figcaption>
        <span className="text-xs text-muted-foreground">{username}</span>
      </div>
    </div>

    <blockquote className="text-sm text-foreground">"{body}"</blockquote>
  </figure>
);

const reviews: ReviewCardProps[] = [
  {
    name: 'Sarah Chen',
    username: '@sarahc',
    body: 'This platform has completely transformed how I connect with my community. The features are intuitive and powerful!',
    img: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Marcus Johnson',
    username: '@marcusj',
    body: 'Best social platform I\'ve used. The privacy controls give me peace of mind while staying connected.',
    img: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Emma Rodriguez',
    username: '@emmar',
    body: 'Love the real-time feed and the ability to discover new communities that match my interests!',
    img: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'David Kim',
    username: '@davidk',
    body: 'The groups feature is amazing! I\'ve found so many like-minded people and made genuine connections.',
    img: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Lisa Anderson',
    username: '@lisaa',
    body: 'Clean interface, great features, and excellent privacy controls. Highly recommended!',
    img: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'James Wilson',
    username: '@jamesw',
    body: 'The video call quality is outstanding and the platform is so easy to use. Five stars!',
    img: 'https://i.pravatar.cc/150?img=6',
  },
];

const firstRowReviews = reviews.slice(0, 3);
const secondRowReviews = reviews.slice(3);

const TestimonialMarquee: React.FC = () => {
  return (
    <section className="relative select-none w-full py-16 flex flex-col gap-12">
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-muted-foreground">Join thousands of happy users worldwide</p>
      </div>

      <Marquee className="[--duration:30s]">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent className="flex gap-6">
          {firstRowReviews.map((review, index) => (
            <MarqueeItem key={index} className="w-80">
              <ReviewCard {...review} />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>

      <Marquee className="[--duration:30s] marquee-reverse">
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent className="flex gap-6">
          {secondRowReviews.map((review, index) => (
            <MarqueeItem key={index + '-2'} className="w-80">
              <ReviewCard {...review} />
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </section>
  );
};

export default TestimonialMarquee;
