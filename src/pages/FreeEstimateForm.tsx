import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Phone, FileText, Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EstimatePhotoUpload from '@/components/estimate-form/EstimatePhotoUpload';

const boilerTypes = ['ES2', 'ESC', 'ALPINE', 'PVG', 'NAVIEN', 'Steam Boiler', 'Hot Air System', 'Indirect', 'HWH', 'Tankless'];
const buriedTankSizes = ['275', '550', '1080', '1550'];
const thermostatsOptions = ['1', '2', '3', '4', '5', '6'];
const zoneOptions = ['1', '2', '3', '4', '5', '6'];
const zoneSizes = ['3/4 inch', '1 inch', '1 1/4 inch'];
const ventLocations = ['In front of house', 'Rear of house', 'Right wall', 'Left wall', 'Through chimney'];
const boilerAccessOptions = ['House', 'Basement'];
const gasNeededOptions = ['Fireplace', 'Barbecue', 'Stove', 'Dryer', 'Boiler', 'Hot Water Heater'];
const meterPositions = [
  'top-left', 'top-center-left', 'top-center', 'top-center-right', 'top-right',
  'upper-left', 'upper-right',
  'middle-left', 'middle-right',
  'lower-left', 'lower-right',
  'bottom-left', 'bottom-center-left', 'bottom-center', 'bottom-center-right', 'bottom-right'
];

const FreeEstimateForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer Info
  const [customer, setCustomer] = useState('');
  const [email, setEmail] = useState('');
  const [costOfJob, setCostOfJob] = useState('');
  
  // Boiler Info
  const [selectedBoilerTypes, setSelectedBoilerTypes] = useState<string[]>([]);
  const [boilerSize, setBoilerSize] = useState('');
  const [baseboard, setBaseboard] = useState('');
  
  // Oil Tank - Buried
  const [buriedTankSize, setBuriedTankSize] = useState<string[]>([]);
  const [pumpAndFoam, setPumpAndFoam] = useState('');
  const [tankSand, setTankSand] = useState('');
  const [buriedPriceAdditional, setBuriedPriceAdditional] = useState('');
  
  // Oil Tank - Interior
  const [interiorTankRemoved, setInteriorTankRemoved] = useState('');
  const [interiorTankBehindWall, setInteriorTankBehindWall] = useState('');
  const [interiorPriceAdditional, setInteriorPriceAdditional] = useState('');
  
  // Oil Tank - Exterior
  const [exterior275Removal, setExterior275Removal] = useState('');
  const [exteriorPriceAdditional, setExteriorPriceAdditional] = useState('');
  
  // Oil Tank - Other
  const [customerResponsibleForTank, setCustomerResponsibleForTank] = useState('');
  const [tankNotes, setTankNotes] = useState('');
  
  // Installation Notes/Venting
  const [steamSystem, setSteamSystem] = useState('');
  const [thermostatsIncluded, setThermostatsIncluded] = useState('');
  const [existingChimneyLined, setExistingChimneyLined] = useState('');
  const [chimneyLinedNotes, setChimneyLinedNotes] = useState('');
  const [ventLocation, setVentLocation] = useState('');
  const [ventLocationNotes, setVentLocationNotes] = useState('');
  const [numberOfZones, setNumberOfZones] = useState('');
  const [zoneSize, setZoneSize] = useState('');
  const [boilerAccess, setBoilerAccess] = useState('');
  
  // Gas Service/Piping
  const [gasNeededFor, setGasNeededFor] = useState<string[]>([]);
  const [gasInHouse, setGasInHouse] = useState('');
  const [gasNotes, setGasNotes] = useState('');
  const [meterLocation, setMeterLocation] = useState('');
  
  // Photos
  const [photos, setPhotos] = useState<string[]>([]);

  const handleBoilerTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedBoilerTypes([...selectedBoilerTypes, type]);
    } else {
      setSelectedBoilerTypes(selectedBoilerTypes.filter(t => t !== type));
    }
  };

  const handleBuriedTankSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setBuriedTankSize([...buriedTankSize, size]);
    } else {
      setBuriedTankSize(buriedTankSize.filter(s => s !== size));
    }
  };

  const handleGasNeededChange = (option: string, checked: boolean) => {
    if (checked) {
      setGasNeededFor([...gasNeededFor, option]);
    } else {
      setGasNeededFor(gasNeededFor.filter(o => o !== option));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and email.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const formData = {
      // Customer Info
      customer: customer.trim(),
      email: email.trim(),
      costOfJob: costOfJob.trim(),
      
      // Boiler Info
      boilerTypes: selectedBoilerTypes,
      boilerSize: boilerSize.trim(),
      baseboard: baseboard.trim(),
      
      // Oil Tank - Buried
      buriedTankSize,
      pumpAndFoam,
      tankSand,
      buriedPriceAdditional,
      
      // Oil Tank - Interior
      interiorTankRemoved,
      interiorTankBehindWall,
      interiorPriceAdditional,
      
      // Oil Tank - Exterior
      exterior275Removal,
      exteriorPriceAdditional,
      
      // Oil Tank - Other
      customerResponsibleForTank,
      tankNotes: tankNotes.trim(),
      
      // Installation Notes/Venting
      steamSystem,
      thermostatsIncluded,
      existingChimneyLined,
      chimneyLinedNotes: chimneyLinedNotes.trim(),
      ventLocation,
      ventLocationNotes: ventLocationNotes.trim(),
      numberOfZones,
      zoneSize,
      boilerAccess,
      
      // Gas Service/Piping
      gasNeededFor,
      gasInHouse,
      gasNotes: gasNotes.trim(),
      meterLocation,
      
      // Photos
      photos
    };

    try {
      const { error } = await supabase.functions.invoke('send-estimate-form', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Estimate Request Submitted!",
        description: "We'll review your information and get back to you soon.",
      });

      // Reset form
      setCustomer('');
      setEmail('');
      setCostOfJob('');
      setSelectedBoilerTypes([]);
      setBoilerSize('');
      setBaseboard('');
      setBuriedTankSize([]);
      setPumpAndFoam('');
      setTankSand('');
      setBuriedPriceAdditional('');
      setInteriorTankRemoved('');
      setInteriorTankBehindWall('');
      setInteriorPriceAdditional('');
      setExterior275Removal('');
      setExteriorPriceAdditional('');
      setCustomerResponsibleForTank('');
      setTankNotes('');
      setSteamSystem('');
      setThermostatsIncluded('');
      setExistingChimneyLined('');
      setChimneyLinedNotes('');
      setVentLocation('');
      setVentLocationNotes('');
      setNumberOfZones('');
      setZoneSize('');
      setBoilerAccess('');
      setGasNeededFor([]);
      setGasInHouse('');
      setGasNotes('');
      setMeterLocation('');
      setPhotos([]);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or call us.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const YesNoRadio = ({ value, onChange, name }: { value: string; onChange: (v: string) => void; name: string }) => (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="Y" id={`${name}-y`} />
        <Label htmlFor={`${name}-y`} className="cursor-pointer">Y</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="N" id={`${name}-n`} />
        <Label htmlFor={`${name}-n`} className="cursor-pointer">N</Label>
      </div>
    </RadioGroup>
  );

  const YesNoFullRadio = ({ value, onChange, name }: { value: string; onChange: (v: string) => void; name: string }) => (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="Yes" id={`${name}-yes`} />
        <Label htmlFor={`${name}-yes`} className="cursor-pointer">Yes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="No" id={`${name}-no`} />
        <Label htmlFor={`${name}-no`} className="cursor-pointer">No</Label>
      </div>
    </RadioGroup>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm border border-secondary/30 mb-6">
              <FileText className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Free Estimate</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Estimate Form
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
              Fill out the form below and we'll provide you with a detailed estimate for your project.
            </p>
            <a 
              href="tel:631-361-9500" 
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-lg font-semibold"
            >
              <Phone className="w-5 h-5" />
              Or call us: 631-361-9500
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Customer Info */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                CUSTOMER INFO:
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Input 
                    id="customer" 
                    value={customer} 
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="costOfJob">Cost Of Job</Label>
                  <Input 
                    id="costOfJob" 
                    value={costOfJob} 
                    onChange={(e) => setCostOfJob(e.target.value)}
                    placeholder="Estimated cost"
                  />
                </div>
              </div>
            </div>

            {/* Boiler Info */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                BOILER INFO:
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Boiler Type:</Label>
                  <div className="flex flex-wrap gap-4">
                    {boilerTypes.map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox 
                          id={`boiler-${type}`}
                          checked={selectedBoilerTypes.includes(type)}
                          onCheckedChange={(checked) => handleBoilerTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={`boiler-${type}`} className="cursor-pointer text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="boilerSize">Boiler Size</Label>
                    <Input 
                      id="boilerSize" 
                      value={boilerSize} 
                      onChange={(e) => setBoilerSize(e.target.value)}
                      placeholder="Enter boiler size"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseboard">Baseboard</Label>
                    <Input 
                      id="baseboard" 
                      value={baseboard} 
                      onChange={(e) => setBaseboard(e.target.value)}
                      placeholder="Enter baseboard info"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Oil Tank */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                OIL TANK:
              </h2>
              
              {/* Buried Tanks */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4">Buried Tanks:</h3>
                <div className="space-y-4 pl-4">
                  <div className="space-y-3">
                    <Label>Buried Tank Size</Label>
                    <div className="flex flex-wrap gap-4">
                      {buriedTankSizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Checkbox 
                            id={`buried-${size}`}
                            checked={buriedTankSize.includes(size)}
                            onCheckedChange={(checked) => handleBuriedTankSizeChange(size, checked as boolean)}
                          />
                          <Label htmlFor={`buried-${size}`} className="cursor-pointer text-sm">{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pump & Foam</Label>
                      <YesNoRadio value={pumpAndFoam} onChange={setPumpAndFoam} name="pumpFoam" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tank Sand</Label>
                      <YesNoRadio value={tankSand} onChange={setTankSand} name="tankSand" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price Additional</Label>
                      <YesNoRadio value={buriedPriceAdditional} onChange={setBuriedPriceAdditional} name="buriedPrice" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interior Tanks */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4">Interior Tanks:</h3>
                <div className="grid md:grid-cols-3 gap-4 pl-4">
                  <div className="space-y-2">
                    <Label>Interior Tank Removed</Label>
                    <YesNoRadio value={interiorTankRemoved} onChange={setInteriorTankRemoved} name="interiorRemoved" />
                  </div>
                  <div className="space-y-2">
                    <Label>Interior Tank Behind Wall</Label>
                    <YesNoRadio value={interiorTankBehindWall} onChange={setInteriorTankBehindWall} name="interiorWall" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Additional</Label>
                    <YesNoRadio value={interiorPriceAdditional} onChange={setInteriorPriceAdditional} name="interiorPrice" />
                  </div>
                </div>
              </div>

              {/* Exterior Tanks */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-foreground mb-4">Exterior Tanks:</h3>
                <div className="grid md:grid-cols-2 gap-4 pl-4">
                  <div className="space-y-2">
                    <Label>Exterior 275 Tank Removal</Label>
                    <YesNoRadio value={exterior275Removal} onChange={setExterior275Removal} name="exteriorRemoval" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Additional</Label>
                    <YesNoRadio value={exteriorPriceAdditional} onChange={setExteriorPriceAdditional} name="exteriorPrice" />
                  </div>
                </div>
              </div>

              {/* Other */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">Other:</h3>
                <div className="space-y-4 pl-4">
                  <div className="space-y-2">
                    <Label>Customer Responsible For Tank Removal</Label>
                    <YesNoRadio value={customerResponsibleForTank} onChange={setCustomerResponsibleForTank} name="customerTank" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tankNotes">Notes</Label>
                    <Textarea 
                      id="tankNotes" 
                      value={tankNotes} 
                      onChange={(e) => setTankNotes(e.target.value)}
                      placeholder="Additional notes about oil tank..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Installation Notes/Venting */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                INSTALLATION NOTES/VENTING:
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Steam System</Label>
                    <YesNoFullRadio value={steamSystem} onChange={setSteamSystem} name="steamSystem" />
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Chimney Lined</Label>
                    <YesNoFullRadio value={existingChimneyLined} onChange={setExistingChimneyLined} name="chimneyLined" />
                    <Input
                      value={chimneyLinedNotes}
                      onChange={(e) => setChimneyLinedNotes(e.target.value)}
                      placeholder="Notes..."
                      className="mt-2"
                    />
                  </div>
                </div>
                
                
                <div className="space-y-3">
                  <Label>Thermostats Included</Label>
                  <RadioGroup value={thermostatsIncluded} onValueChange={setThermostatsIncluded} className="flex flex-wrap gap-4">
                    {thermostatsOptions.map((num) => (
                      <div key={num} className="flex items-center gap-2">
                        <RadioGroupItem value={num} id={`thermo-${num}`} />
                        <Label htmlFor={`thermo-${num}`} className="cursor-pointer">{num}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Vent Location for Boiler</Label>
                  <RadioGroup value={ventLocation} onValueChange={setVentLocation} className="flex flex-wrap gap-4">
                    {ventLocations.map((loc) => (
                      <div key={loc} className="flex items-center gap-2">
                        <RadioGroupItem value={loc} id={`vent-${loc}`} />
                        <Label htmlFor={`vent-${loc}`} className="cursor-pointer text-sm">{loc}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Input
                    value={ventLocationNotes}
                    onChange={(e) => setVentLocationNotes(e.target.value)}
                    placeholder="Notes..."
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label>Number of Zones</Label>
                    <RadioGroup value={numberOfZones} onValueChange={setNumberOfZones} className="flex flex-wrap gap-3">
                      {zoneOptions.map((num) => (
                        <div key={num} className="flex items-center gap-2">
                          <RadioGroupItem value={num} id={`zone-${num}`} />
                          <Label htmlFor={`zone-${num}`} className="cursor-pointer">{num}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label>Zone Size</Label>
                    <RadioGroup value={zoneSize} onValueChange={setZoneSize} className="flex flex-col gap-2">
                      {zoneSizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <RadioGroupItem value={size} id={`zonesize-${size}`} />
                          <Label htmlFor={`zonesize-${size}`} className="cursor-pointer text-sm">{size}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-3">
                    <Label>Boiler Access</Label>
                    <RadioGroup value={boilerAccess} onValueChange={setBoilerAccess} className="flex flex-col gap-2">
                      {boilerAccessOptions.map((opt) => (
                        <div key={opt} className="flex items-center gap-2">
                          <RadioGroupItem value={opt} id={`access-${opt}`} />
                          <Label htmlFor={`access-${opt}`} className="cursor-pointer">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Gas Service/Piping */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                GAS SERVICE/PIPING:
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Gas Needed For</Label>
                  <div className="flex flex-wrap gap-4">
                    {gasNeededOptions.map((opt) => (
                      <div key={opt} className="flex items-center gap-2">
                        <Checkbox 
                          id={`gas-${opt}`}
                          checked={gasNeededFor.includes(opt)}
                          onCheckedChange={(checked) => handleGasNeededChange(opt, checked as boolean)}
                        />
                        <Label htmlFor={`gas-${opt}`} className="cursor-pointer text-sm">{opt}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gas in House</Label>
                  <YesNoFullRadio value={gasInHouse} onChange={setGasInHouse} name="gasInHouse" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gasNotes">Notes</Label>
                  <Textarea 
                    id="gasNotes" 
                    value={gasNotes} 
                    onChange={(e) => setGasNotes(e.target.value)}
                    placeholder="Additional notes about gas service..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Meter Location (select position around house)</Label>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                      {/* Top row */}
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('top-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'top-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('top-center-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'top-center-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('top-center')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'top-center' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('top-center-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'top-center-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('top-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'top-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      
                      {/* Upper sides */}
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('upper-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'upper-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="col-span-3 flex items-center justify-center">
                        <div className="w-full h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">House</div>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('upper-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'upper-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      
                      {/* Lower sides */}
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('lower-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'lower-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="col-span-3"></div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('lower-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'lower-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      
                      {/* Bottom row */}
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('bottom-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'bottom-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('bottom-center-left')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'bottom-center-left' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('bottom-center')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'bottom-center' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('bottom-center-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'bottom-center-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                      <div className="flex justify-center">
                        <button type="button" onClick={() => setMeterLocation('bottom-right')} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${meterLocation === 'bottom-right' ? 'bg-secondary text-secondary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>M</button>
                      </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-2">Street (bottom)</p>
                    {meterLocation && (
                      <p className="text-center text-sm font-medium text-foreground mt-2">
                        Selected: {meterLocation.replace(/-/g, ' ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Photos Section */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-heading text-xl font-bold text-secondary mb-6 pb-2 border-b border-border">
                <Camera className="w-5 h-5 inline-block mr-2" />
                PHOTOS:
              </h2>
              <EstimatePhotoUpload 
                photos={photos} 
                onPhotosChange={setPhotos} 
                maxPhotos={10} 
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Estimate Request'
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FreeEstimateForm;
