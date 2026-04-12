import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 2, 2026</p>
            </div>
          </div>

          <Card className="glass-card">
            <CardContent className="p-8">
              <ScrollArea className="h-auto">
                <div className="prose prose-invert max-w-none space-y-8">
                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      FanArena Pro (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                      when you use our Platform. Please read this policy carefully. By using FanArena Pro, 
                      you consent to the practices described herein.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">2. Information We Collect</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We collect the following categories of information:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li><strong>Personal Information:</strong> Email address, username, display name, avatar</li>
                      <li><strong>Usage Data:</strong> Live calls, scores, platform activity, feature interactions</li>
                      <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                      <li><strong>Payment Information:</strong> Processed securely by our third-party payment providers</li>
                      <li><strong>Communications:</strong> Messages sent through the Platform, support inquiries</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">3. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use your information to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process transactions and send related information</li>
                      <li>Send service-related communications and updates</li>
                      <li>Personalize your experience and provide tailored content</li>
                      <li>Monitor and analyze usage patterns and trends</li>
                      <li>Detect, prevent, and address fraud and security issues</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">4. Information Sharing</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We may share your information with:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li><strong>Service Providers:</strong> Third parties that perform services on our behalf (hosting, analytics, payment processing)</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                      <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      <strong>We do not sell your personal information to third parties.</strong>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">5. Data Retention</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We retain your personal information for as long as your account is active or as needed to 
                      provide services. We may retain certain information for up to 3 years after account deletion 
                      for legal compliance, dispute resolution, and enforcement of our agreements. Usage logs 
                      are typically retained for 12 months.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">6. Your Rights and Choices</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Depending on your location, you may have the following rights:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                      <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                      <li><strong>Do Not Sell:</strong> California residents may opt out of data sales (we do not sell data)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">7. California Privacy Rights (CCPA)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you are a California resident, you have additional rights under the California Consumer 
                      Privacy Act (CCPA), including the right to know what personal information we collect, 
                      the right to delete your information, and the right to opt out of the sale of your 
                      personal information. We do not sell personal information. To exercise your rights, 
                      contact us at privacy@fanarena.pro.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">8. Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your data, 
                      including SSL/TLS encryption, secure authentication, restricted data access, and 
                      continuous monitoring. However, no method of transmission over the Internet is 
                      100% secure, and we cannot guarantee absolute security.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">9. Cookies and Tracking</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use cookies and similar technologies for essential functionality and analytics. 
                      Essential cookies are required for the Platform to function. Analytics cookies help 
                      us understand how users interact with our Platform. You can manage cookie preferences 
                      through your browser settings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">10. Children&apos;s Privacy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      FanArena Pro is not intended for children under 13 years of age. We do not knowingly 
                      collect personal information from children under 13. If you believe we have collected 
                      information from a child under 13, please contact us immediately.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">11. International Transfers</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Your information may be transferred to and processed in countries other than your own. 
                      We ensure appropriate safeguards are in place to protect your data in accordance with 
                      this Privacy Policy.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">12. Changes to This Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of material 
                      changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">13. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      For questions about this Privacy Policy or to exercise your privacy rights, contact us at: 
                      <a href="mailto:privacy@fanarena.pro" className="text-primary hover:underline ml-1">
                        privacy@fanarena.pro
                      </a>
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      FanArena Pro Inc.<br />
                      Attn: Privacy Team<br />
                      123 Innovation Drive, Suite 400<br />
                      San Francisco, CA 94105<br />
                      United States
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

export default Privacy;
