import bestOfPorch from '@/assets/certifications/best-of-porch-2020.png';
import nycMasterPlumbers from '@/assets/certifications/NYC-Master-Plumbers-Council.gif';
import wardflexCertified from '@/assets/certifications/wardflex-certified-small.gif';
import epaLeadSafe from '@/assets/certifications/epa_leadsafecertfirm-trans.gif';
import nationalGrid from '@/assets/certifications/National-Grid-Valueplus.gif';
import liheap from '@/assets/certifications/liheap-logo-trans.gif';

const certifications = [
  { name: 'Best of Porch 2020', logo: bestOfPorch },
  { name: 'NYC Master Plumbers Council', logo: nycMasterPlumbers },
  { name: 'WardFlex Trained & Certified', logo: wardflexCertified },
  { name: 'EPA Lead-Safe Certified Firm', logo: epaLeadSafe },
  { name: 'National Grid Value Plus Installer', logo: nationalGrid },
  { name: 'LIHEAP', logo: liheap },
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
            Certifications
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Licensed, Certified & Trusted
          </h2>
          <p className="text-lg text-muted-foreground">
            Our team holds industry-leading certifications, ensuring quality workmanship 
            and compliance with the highest standards.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.name}
              className="bg-card p-6 rounded-2xl shadow-card flex items-center justify-center aspect-square hover:shadow-medium transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={cert.logo}
                alt={cert.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
