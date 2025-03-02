import Link from "next/link"
import { ArrowRight, CheckCircle, Gift, Heart, Search, Users } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorks() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How GiveShare Works
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                Our platform connects donors with recipients in a simple, transparent process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Create an Account</h3>
              <p className="text-center text-muted-foreground">
                Sign up for a free account to start donating or requesting items.
              </p>
              <img
                alt="Create Account"
                className="aspect-video w-full rounded-lg object-cover"
                height="225"
                src="/placeholder.svg?height=225&width=400"
                width="400"
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">List or Browse</h3>
              <p className="text-center text-muted-foreground">
                List items you want to donate or browse available donations.
              </p>
              <img
                alt="List or Browse"
                className="aspect-video w-full rounded-lg object-cover"
                height="225"
                src="/placeholder.svg?height=225&width=400"
                width="400"
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Connect</h3>
              <p className="text-center text-muted-foreground">
                Donors and recipients connect through our secure platform.
              </p>
              <img
                alt="Connect"
                className="aspect-video w-full rounded-lg object-cover"
                height="225"
                src="/placeholder.svg?height=225&width=400"
                width="400"
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold">Complete the Transaction</h3>
              <p className="text-center text-muted-foreground">
                Arrange pickup or delivery and confirm when complete.
              </p>
              <img
                alt="Complete Transaction"
                className="aspect-video w-full rounded-lg object-cover"
                height="225"
                src="/placeholder.svg?height=225&width=400"
                width="400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Donors Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                For Donors
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                How to donate items on our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>List Your Item</CardTitle>
                <CardDescription>Create a listing with photos and details</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Take clear photos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Describe condition accurately</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Set pickup/delivery options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Review Requests</CardTitle>
                <CardDescription>Choose who receives your donation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>View recipient profiles</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Read request messages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Select the best match</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Complete Donation</CardTitle>
                <CardDescription>Finalize the donation process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Coordinate handover</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Mark as completed</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Receive feedback</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/donate">
                Start Donating
                <Gift className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Recipients Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                For Recipients
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                How to request and receive items on our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Browse Listings</CardTitle>
                <CardDescription>Find items you need</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Search by category</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Filter by location</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>View item details</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request Items</CardTitle>
                <CardDescription>Express your need</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Send a request message</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Explain your situation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Suggest pickup options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Receive Donation</CardTitle>
                <CardDescription>Complete the process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Coordinate with donor</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Confirm receipt</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Leave feedback</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/browse">
                Browse Donations
                <Search className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Common questions about our donation platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Is this service free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes, our platform is completely free to use for both donors and recipients. We believe in removing barriers to giving and receiving help.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How do you verify users?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We verify users through email confirmation and maintain a rating system to build trust in our community. Admins also review listings before they go live.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I donate services?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Currently, our platform focuses on physical items. We may expand to services in the future.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What if I can't arrange pickup?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You can specify delivery options in your listing. Some donors offer delivery, or you can arrange third-party delivery services.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Get Started?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community today and start giving or receiving help.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">
                  Create Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/browse">
                  Browse Donations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
