import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Phone, DollarSign } from 'lucide-react';
import regionsLogo from '@/assets/financing/regions-logo.png';
import banner899 from '@/assets/financing/PreQualify_AsLowAs_8.99_TIL.png';
import banner12mo from '@/assets/financing/PreQualify_12Mo-SAC.png';
import banner999 from '@/assets/financing/PreQualify_9.99-5Yr.png';

const loanPrograms = [
  {
    title: 'Traditional Installment Loan',
    subtitle: 'As Low As 8.99% APR',
    description: 'Affordable fixed-rate financing with flexible repayment terms from 12 to 144 months.',
    banner: banner899,
    link: 'https://prequalification.enerbank.com/apply/loanproduct?lenderID=10368&loanCode=DEL2622',
    disclaimer: '*Credit and loans provided by Regions Bank, Member FDIC, (650 S. Main St., Suite 1000, Salt Lake City, UT 84101) on approved credit, for a limited time. 8.99% to 24.49% fixed APR (provided however, APR will not exceed 15.99% for residents of New Jersey and 17.99% for residents of Florida and Wisconsin), subject to change. Minimum loan amounts apply. Interest starts accruing when funds are disbursed. Open line period payments due 90 days after origination and monthly thereafter during open line period. When open line period ends, the balance becomes a fixed rate installment loan; repayment terms vary from 12 to 144 months. Actual loan term may be shorter if less than the full approved amount of credit is used. First monthly loan payment due 30 days from the end of the open line period. Monthly payments vary from $11.49 to $30.27 per $1,000 borrowed depending on term and interest rate. The minimum monthly payment will be no less than $50.00.',
  },
  {
    title: '12-Month Same-As-Cash Loan',
    subtitle: 'No Payments or Interest for 12 Months',
    description: 'Pay nothing for a full year — interest is waived if repaid within 365 days of first disbursement.',
    banner: banner12mo,
    link: 'https://prequalification.enerbank.com/apply/loanproduct?lenderID=10368&loanCode=DEL2625',
    disclaimer: '*Credit and loans provided by Regions Bank, Member FDIC, (650 S. Main St., Suite 1000, Salt Lake City, UT 84101) on approved credit, for a limited time. 19.99% fixed APR (provided however, APR will not exceed 15.99% for residents of New Jersey and 17.99% for residents of Florida and Wisconsin), effective as of February 2026, subject to change. Minimum loan amounts apply. Interest starts accruing when funds are disbursed. Interest waived if repaid in 365 days from first disbursement. When open line period ends, the balance becomes a fixed rate installment loan; repayment terms vary from 24 to 132 months. Actual loan term may be shorter if less than the full approved amount of credit is used. First monthly loan payment due 365 days after first disbursement. If no payments made during same-as-cash period and APR of 19.99%, monthly payments vary from $21.99 to $30.82 per $1,000 borrowed depending on term. The minimum monthly payment will be no less than $50.00.',
  },
  {
    title: '9.99% APR 5-Year Loan',
    subtitle: 'Fixed 9.99% APR — 60-Month Term',
    description: 'Predictable monthly payments over 5 years with a competitive fixed rate.',
    banner: banner999,
    link: 'https://prequalification.enerbank.com/apply/loanproduct?lenderID=10368&loanCode=DEL2674',
    disclaimer: '*Credit and loans provided by Regions Bank, Member FDIC, (650 S. Main St., Suite 1000, Salt Lake City, UT 84101) on approved credit, for a limited time. 9.99% fixed APR, subject to change. Minimum loan amounts apply. Interest starts accruing when funds are disbursed. Open line period payments due 90 days after origination and monthly thereafter during open line period. When open line period ends, the balance becomes a fixed rate installment loan; repayment term is 60 months. Actual loan term may be shorter if less than the full approved amount of credit is used. First monthly loan payment due 30 days from the end of the open line period. 60 monthly payments of $21.69 per $1,000 borrowed. The minimum monthly payment will be no less than $50.00.',
  },
];

const Financing = () => {
  return (
    <>
      <SEO
        title="Financing Available | Big City Plumbing & Heating"
        description="Flexible home improvement financing through Regions Bank. Apply for a Traditional Installment Loan, 12-Month Same-As-Cash, or 5-Year fixed rate loan. Pre-qualify in minutes."
        canonical="/financing"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient min-h-[420px] flex items-center">
        <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 text-primary-foreground">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Flexible Home Improvement Financing</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-4">
              Flexible Financing for Your Home Project
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Big City Plumbing &amp; Heating has partnered with Regions Bank to offer affordable financing options so you can get the work done now and pay over time.
            </p>
            <img
              src={regionsLogo}
              alt="Regions Home Improvement Financing"
              className="h-16 w-auto bg-white/90 rounded-xl px-4 py-2 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-muted/40 py-12 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Don't Let Budget Hold Back Your Comfort
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choose from three loan programs designed for home improvement projects. Click any banner below to pre-qualify — it only takes a few minutes and won't affect your credit score to check your options.
          </p>
        </div>
      </section>

      {/* Loan Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loanPrograms.map((program) => (
              <div
                key={program.title}
                className="bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col"
              >
                {/* Clickable Banner */}
                <a
                  href={program.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative overflow-hidden"
                >
                  <img
                    src={program.banner}
                    alt={program.title}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </a>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1 mb-6">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">{program.title}</h3>
                    <p className="text-secondary font-semibold text-sm mb-1">{program.subtitle}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{program.description}</p>
                  </div>

                  <Button asChild className="w-full mb-4">
                    <a href={program.link} target="_blank" rel="noopener noreferrer">
                      PreQualify Now
                    </a>
                  </Button>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {program.disclaimer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-14">
        <div className="container mx-auto px-4 lg:px-8 text-center text-primary-foreground">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Have Questions About Financing?</h2>
          <p className="opacity-80 mb-6 text-lg">Our team can help you choose the right option for your project.</p>
          <Button variant="hero" size="lg" asChild>
            <a href="tel:631-361-9500" className="inline-flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Us: 631-361-9500
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Financing;
