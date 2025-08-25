"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Check, Crown, ArrowLeft, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function PricingPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push("/")
  }

  const handleSubscribe = (plan: string) => {
    // This would integrate with a payment processor like Stripe
    console.log(`Subscribe to ${plan} plan`)
    // For now, just show a placeholder message
    alert(`${plan} plan subscription coming soon!`)
  }

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId)
  }

  const faqs = [
    {
      id: "why-get-it",
      question: "Why should I get it?",
      answer:
        "Our 3D model generator uses advanced AI to create high-quality 3D models from simple text descriptions. It saves you hours of manual modeling work and provides professional results instantly.",
    },
    {
      id: "what-will-get",
      question: "What will I get?",
      answer:
        "You'll get access to our AI-powered 3D model generator, multiple export formats (OBJ, STL, FBX, GLTF), cloud storage for your models, and priority customer support.",
    },
    {
      id: "future-updates",
      question: "Will I get future updates?",
      answer:
        "Yes! All subscribers receive free updates including new features, improved AI models, additional export formats, and enhanced generation quality.",
    },
    {
      id: "when-released",
      question: "When will it be released?",
      answer:
        "The full 3D model generation feature is currently in development. Beta access will be available to Pro subscribers in Q2 2024, with full release planned for Q3 2024.",
    },
    {
      id: "one-time-purchase",
      question: "Is it a one time purchase item?",
      answer:
        "No, this is a subscription-based service. This allows us to continuously improve the AI models, add new features, and provide ongoing support and cloud infrastructure.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="py-8 px-4">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto mb-8">
          <Button onClick={handleBackClick} variant="ghost" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generator
          </Button>
        </div>

        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Upgrade Your Experience</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited 3D model generation and premium features with our subscription plans.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">
                $0<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 models per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic model quality</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Standard export formats</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Community support</span>
                </li>
              </ul>
              <Button className="w-full bg-transparent" variant="outline" disabled={!isSignedIn}>
                {isSignedIn ? "Current Plan" : "Sign up to start"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-blue-500 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious creators</CardDescription>
              <div className="text-3xl font-bold">
                $19<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>100 models per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>High-quality models</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>All export formats</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced customization</span>
                </li>
              </ul>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => handleSubscribe("Pro")}
                disabled={!isSignedIn}
              >
                {isSignedIn ? "Subscribe to Pro" : "Sign up to subscribe"}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For teams and businesses</CardDescription>
              <div className="text-3xl font-bold">
                $99<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited models</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Ultra-high quality</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>All formats + API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Team collaboration</span>
                </li>
              </ul>
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => handleSubscribe("Enterprise")}
                disabled={!isSignedIn}
              >
                {isSignedIn ? "Contact Sales" : "Sign up to contact"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Collapsible key={faq.id} open={openFAQ === faq.id} onOpenChange={() => toggleFAQ(faq.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-6 h-auto text-left bg-white hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    {openFAQ === faq.id ? (
                      <Minus className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6 bg-white rounded-b-lg border-l border-r border-b border-gray-200 -mt-1">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-start">
            {/* Company Info - Left side */}
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Model Generator</h3>
              <p className="text-gray-600">Copyright © 2024. All rights reserved.</p>
            </div>

            {/* Policies and Contact - Right side with gap */}
            <div className="flex gap-16">
              {/* Policies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                    Terms and Conditions
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-2">
                  <a
                    href="mailto:support@3dmodelgen.com"
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Email
                  </a>
                  <a
                    href="https://twitter.com/3dmodelgen"
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
