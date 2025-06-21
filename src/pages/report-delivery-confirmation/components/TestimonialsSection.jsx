import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const TestimonialsSection = ({ profession = 'teacher' }) => {
  const getProfessionTestimonials = () => {
    const testimonials = {
      teacher: [
        {
          name: "Sarah Mitchell",
          title: "High School Math Teacher",
          location: "Austin, TX",
          years: "18 years of service",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `I had no idea I was facing a $180,000 retirement gap! This analysis opened my eyes to issues with my pension that I never would have discovered on my own. The consultation helped me create a plan to fix everything.`
        },
        {
          name: "Michael Rodriguez",
          title: "Elementary Principal",
          location: "Denver, CO", 
          years: "22 years of service",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `The tax torpedo section was eye-opening. I was planning to retire at 62, but this showed me how much that would cost in taxes. Now I have a strategy to save over $40,000!`
        }
      ],
      nurse: [
        {
          name: "Jennifer Chen",
          title: "ICU Nurse",
          location: "Seattle, WA",
          years: "15 years of service",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `Working nights and weekends, I never had time to figure out my retirement planning. This tool made it so simple and showed me exactly what I needed to do to secure my future.`
        },
        {
          name: "David Park",
          title: "Charge Nurse",
          location: "Phoenix, AZ",
          years: "20 years of service", 
          avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `I discovered I was missing out on $25,000 in annual benefits I didn't even know existed. The audit consultation was incredibly valuable - worth every minute.`
        }
      ],
      'first-responder': [
        {
          name: "Captain Lisa Thompson",
          title: "Fire Captain",
          location: "Miami, FL",
          years: "16 years of service",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `As a first responder, I always put others first. This analysis helped me finally put my family's financial security first. The survivor benefit gap was something I never considered.`
        },
        {
          name: "Officer James Wilson",
          title: "Police Sergeant",
          location: "Chicago, IL",
          years: "19 years of service",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `The early retirement options for first responders are complex. This tool broke it all down and showed me the best path forward. Highly recommend to all my fellow officers.`
        }
      ],
      'government-employee': [
        {
          name: "Maria Gonzalez",
          title: "City Administrator",
          location: "San Antonio, TX",
          years: "14 years of service",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `Government benefits are so confusing. This analysis made everything clear and showed me I was leaving money on the table. The consultation was incredibly helpful.`
        },
        {
          name: "Robert Kim",
          title: "State Analyst",
          location: "Sacramento, CA",
          years: "25 years of service",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          rating: 5,
          text: `After 25 years in government service, I thought I knew all my benefits. This tool revealed gaps I never knew existed and gave me a clear action plan.`
        }
      ]
    };

    return testimonials[profession] || testimonials.teacher;
  };

  const testimonials = getProfessionTestimonials();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? "text-accent fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
        <Icon name="MessageSquare" size={24} />
        What Others Are Saying
      </h2>

      <div className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border-l-4 border-l-primary pl-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-text-secondary text-sm leading-relaxed mb-3">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="text-sm">
                  <div className="font-semibold text-text-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-text-secondary">
                    {testimonial.title} • {testimonial.location}
                  </div>
                  <div className="text-primary text-xs font-medium">
                    {testimonial.years}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">10,000+</div>
            <div className="text-xs text-text-secondary">Reports Generated</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">4.9/5</div>
            <div className="text-xs text-text-secondary">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">$2.3M</div>
            <div className="text-xs text-text-secondary">Gaps Identified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;