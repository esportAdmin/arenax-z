import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: January 2, 2026</p>
            </div>
          </div>

          <Card className="glass-card">
            <CardContent className="p-8">
              <ScrollArea className="h-auto">
                <div className="prose prose-invert max-w-none space-y-8">
                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing or using FanArena Pro (the &quot;Platform&quot;), you agree to be bound by these 
                      Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our services.
                      Your continued use of the Platform constitutes acceptance of any modifications to these Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">2. Description of Services</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      FanArena Pro is an entertainment platform that allows users to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Make predictions on esports events</li>
                      <li>Earn and exchange Arena Points (virtual currency with no monetary value)</li>
                      <li>Participate in leaderboards and challenges</li>
                      <li>Join clubs and interact with other fans</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">3. Eligibility</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      You must be at least 18 years old or the age of majority in your jurisdiction to use this Platform.
                      By using FanArena Pro, you represent and warrant that you meet these eligibility requirements.
                      If you are under 18, you may only use the Platform with the consent of a parent or legal guardian.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">4. User Accounts</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      When creating an account, you agree to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Provide accurate and complete information</li>
                      <li>Maintain the security of your login credentials</li>
                      <li>Promptly update any changes to your information</li>
                      <li>Not create multiple accounts or share your account</li>
                      <li>Accept responsibility for all activities under your account</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">5. Arena Points</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Arena Points are virtual gaming units used exclusively on the Platform. They have no real monetary 
                      value and cannot be exchanged for real currency. Arena Points may be earned through platform 
                      activities or purchased through optional packages. Arena Points are non-refundable and 
                      non-transferable except as permitted by the Platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">6. Prohibited Conduct</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Users agree not to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Use the Platform for any illegal purpose</li>
                      <li>Post unlawful, threatening, abusive, or discriminatory content</li>
                      <li>Harass, bully, or intimidate other users</li>
                      <li>Attempt to manipulate Platform systems or exploit bugs</li>
                      <li>Use bots, scripts, or automated tools</li>
                      <li>Engage in match-fixing or collusion</li>
                      <li>Impersonate others or misrepresent your identity</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">7. Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All content on the Platform, including logos, text, graphics, and software, is the exclusive 
                      property of FanArena Pro or its licensors and is protected by U.S. and international 
                      copyright, trademark, and other intellectual property laws. Unauthorized reproduction, 
                      distribution, or modification is strictly prohibited.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">8. Disclaimer of Warranties</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                      EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
                      FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE UNINTERRUPTED 
                      OR ERROR-FREE SERVICE.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">9. Limitation of Liability</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, FANARENA PRO SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                      INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                      WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
                      INTANGIBLE LOSSES.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">10. Indemnification</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      You agree to indemnify, defend, and hold harmless FanArena Pro, its officers, directors, 
                      employees, and agents from any claims, damages, losses, liabilities, and expenses arising 
                      from your use of the Platform or violation of these Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">11. Governing Law</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, 
                      United States, without regard to its conflict of law provisions. Any disputes shall be resolved 
                      exclusively in the state or federal courts located in Delaware.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">12. Changes to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We reserve the right to modify these Terms at any time. We will notify users of material 
                      changes via email or Platform notification. Continued use after changes constitutes acceptance.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">13. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      For questions about these Terms, please contact us at: 
                      <a href="mailto:legal@fanarena.pro" className="text-primary hover:underline ml-1">
                        legal@fanarena.pro
                      </a>
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;