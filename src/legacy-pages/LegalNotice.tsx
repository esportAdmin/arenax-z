import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scale } from 'lucide-react';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Legal Notice</h1>
              <p className="text-muted-foreground">Company and legal information</p>
            </div>
          </div>

          <Card className="glass-card">
            <CardContent className="p-8">
              <ScrollArea className="h-auto">
                <div className="prose prose-invert max-w-none space-y-8">
                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">1. Company Information</h2>
                    <div className="text-muted-foreground leading-relaxed space-y-2">
                      <p><strong>Company Name:</strong> FanArena Pro Inc.</p>
                      <p><strong>Entity Type:</strong> Delaware Corporation</p>
                      <p><strong>Headquarters:</strong> 123 Innovation Drive, Suite 400, San Francisco, CA 94105, United States</p>
                      <p><strong>EIN:</strong> 12-3456789</p>
                      <p><strong>CEO:</strong> John Smith</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">2. Contact Information</h2>
                    <div className="text-muted-foreground leading-relaxed space-y-2">
                      <p>
                        <strong>General Inquiries:</strong> 
                        <a href="mailto:contact@fanarena.pro" className="text-primary hover:underline ml-1">
                          contact@fanarena.pro
                        </a>
                      </p>
                      <p>
                        <strong>Support:</strong> 
                        <a href="mailto:support@fanarena.pro" className="text-primary hover:underline ml-1">
                          support@fanarena.pro
                        </a>
                      </p>
                      <p>
                        <strong>Legal:</strong> 
                        <a href="mailto:legal@fanarena.pro" className="text-primary hover:underline ml-1">
                          legal@fanarena.pro
                        </a>
                      </p>
                      <p><strong>Phone:</strong> +1 (415) 555-0123</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">3. Hosting Provider</h2>
                    <div className="text-muted-foreground leading-relaxed space-y-2">
                      <p><strong>Provider:</strong> Amazon Web Services (AWS)</p>
                      <p><strong>Address:</strong> 410 Terry Avenue North, Seattle, WA 98109</p>
                      <p><strong>Website:</strong> <a href="https://aws.amazon.com" className="text-primary hover:underline">aws.amazon.com</a></p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">4. Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All content on this website, including but not limited to text, graphics, logos, icons, 
                      images, audio clips, and software, is the exclusive property of FanArena Pro Inc. or 
                      its content suppliers and is protected by United States and international copyright laws.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      The FanArena Pro name, logo, and all related product and service names, design marks, 
                      and slogans are trademarks of FanArena Pro Inc. You may not use these marks without 
                      prior written permission.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">5. Third-Party Trademarks</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All esports team names, game titles, and related marks mentioned on this platform are 
                      trademarks of their respective owners. FanArena Pro is not affiliated with, endorsed by, 
                      or sponsored by any game publisher or esports organization unless explicitly stated.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">6. Disclaimer</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      FanArena Pro is an entertainment platform. Arena Points are virtual items with no 
                      real-world monetary value and cannot be exchanged for cash or real currency. 
                      The platform is designed for community engagement, retention, and competitive entertainment.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      The information provided on this website is for general informational purposes only. 
                      While we strive for accuracy, we make no warranties regarding the completeness, 
                      reliability, or accuracy of any information.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">7. External Links</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      This website may contain links to third-party websites. FanArena Pro has no control 
                      over the content, privacy policies, or practices of these sites and assumes no 
                      responsibility for them. We encourage you to review the terms and privacy policies 
                      of any third-party sites you visit.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">8. DMCA Notice</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you believe that your copyrighted work has been copied in a way that constitutes 
                      copyright infringement, please provide our Copyright Agent with a written notification 
                      containing the information required by the Digital Millennium Copyright Act (DMCA).
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      <strong>DMCA Agent:</strong><br />
                      FanArena Pro Inc.<br />
                      Attn: DMCA Agent<br />
                      123 Innovation Drive, Suite 400<br />
                      San Francisco, CA 94105<br />
                      <a href="mailto:dmca@fanarena.pro" className="text-primary hover:underline">dmca@fanarena.pro</a>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">9. Governing Law</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      This Legal Notice and any disputes arising from it shall be governed by and construed 
                      in accordance with the laws of the State of Delaware, United States, without regard 
                      to its conflict of law provisions.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-display font-bold text-primary mb-4">10. Credits</h2>
                    <div className="text-muted-foreground leading-relaxed space-y-2">
                      <p><strong>Design & Development:</strong> FanArena Pro Engineering Team</p>
                      <p><strong>Icons:</strong> Lucide Icons (MIT License)</p>
                      <p><strong>Fonts:</strong> Orbitron, Inter (Google Fonts)</p>
                    </div>
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

export default LegalNotice;
