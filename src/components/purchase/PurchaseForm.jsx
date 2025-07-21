import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CreditCard, 
  DollarSign, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';
import gsap from 'gsap';

export default function PurchaseForm({ 
  artwork, 
  gallery, 
  open, 
  onClose, 
  onPurchaseComplete 
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [formData, setFormData] = useState({
    // Buyer Information
    buyerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    },
    // Payment Information
    paymentInfo: {
      method: 'credit_card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        sameAsShipping: true,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    },
    // Additional Options
    deliveryOptions: {
      method: 'standard',
      insurance: false,
      gift: false,
      giftMessage: ''
    },
    // Terms and Conditions
    agreedToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [paymentMethods] = useState([
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard },
    { id: 'debit_card', name: 'Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: DollarSign }
  ]);

  // Animation effects with GSAP
  useEffect(() => {
    if (open) {
      gsap.fromTo('.purchase-form-content', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [open, step]);

  useEffect(() => {
    if (purchaseComplete) {
      gsap.fromTo('.success-animation',
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }
  }, [purchaseComplete]);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedFormData = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      // Validate buyer information
      if (!formData.buyerInfo.firstName) newErrors.firstName = 'First name is required';
      if (!formData.buyerInfo.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.buyerInfo.email) newErrors.email = 'Email is required';
      if (!formData.buyerInfo.phone) newErrors.phone = 'Phone number is required';
      if (!formData.buyerInfo.address.street) newErrors.street = 'Street address is required';
      if (!formData.buyerInfo.address.city) newErrors.city = 'City is required';
      if (!formData.buyerInfo.address.state) newErrors.state = 'State is required';
      if (!formData.buyerInfo.address.zipCode) newErrors.zipCode = 'ZIP code is required';
    }

    if (stepNumber === 2) {
      // Validate payment information
      if (!formData.paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.paymentInfo.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!formData.paymentInfo.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!formData.paymentInfo.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.paymentInfo.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
    }

    if (stepNumber === 3) {
      // Validate terms and conditions
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handlePurchase = async () => {
    if (!validateStep(3)) return;

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const purchaseData = {
        id: `purchase_${Date.now()}`,
        artId: artwork.id,
        galleryId: gallery.id,
        buyerInfo: formData.buyerInfo,
        paymentInfo: {
          method: formData.paymentInfo.method,
          amount: artwork.price,
          currency: 'USD',
          transactionId: `txn_${Date.now()}`,
          status: 'completed'
        },
        purchaseDate: new Date().toISOString(),
        deliveryStatus: 'pending',
        notes: formData.deliveryOptions.giftMessage
      };

      setPurchaseComplete(true);
      
      // Call the completion handler after a delay for animation
      setTimeout(() => {
        onPurchaseComplete(purchaseData);
      }, 2000);

    } catch (error) {
      console.error('Purchase failed:', error);
      setErrors({ general: 'Purchase failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = artwork.price;
    if (formData.deliveryOptions.insurance) total += 50;
    if (formData.deliveryOptions.method === 'express') total += 25;
    return total;
  };

  if (!artwork) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto purchase-form-content">
        {!purchaseComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Secure Purchase
              </DialogTitle>
              <DialogDescription>
                Complete your purchase of "{artwork.title}" by {artwork.artist}
              </DialogDescription>
            </DialogHeader>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-600">
                    {stepNum === 1 && 'Buyer Info'}
                    {stepNum === 2 && 'Payment'}
                    {stepNum === 3 && 'Review'}
                  </div>
                  {stepNum < 3 && <div className="w-12 h-0.5 bg-gray-200 ml-4" />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2">
                {/* Step 1: Buyer Information */}
                {step === 1 && (
                  <BuyerInformationStep
                    formData={formData}
                    errors={errors}
                    updateFormData={updateFormData}
                    updateNestedFormData={updateNestedFormData}
                  />
                )}

                {/* Step 2: Payment Information */}
                {step === 2 && (
                  <PaymentInformationStep
                    formData={formData}
                    errors={errors}
                    paymentMethods={paymentMethods}
                    updateFormData={updateFormData}
                    updateNestedFormData={updateNestedFormData}
                  />
                )}

                {/* Step 3: Review and Confirm */}
                {step === 3 && (
                  <ReviewStep
                    formData={formData}
                    errors={errors}
                    artwork={artwork}
                    total={calculateTotal()}
                    updateFormData={updateFormData}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={step === 1 ? onClose : handlePreviousStep}
                  >
                    {step === 1 ? 'Cancel' : 'Previous'}
                  </Button>
                  
                  {step < 3 ? (
                    <Button onClick={handleNextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePurchase}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Processing...' : `Complete Purchase - $${calculateTotal()}`}
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummary
                  artwork={artwork}
                  deliveryOptions={formData.deliveryOptions}
                  total={calculateTotal()}
                />
              </div>
            </div>
          </>
        ) : (
          <PurchaseSuccess artwork={artwork} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Buyer Information Step Component
function BuyerInformationStep({ formData, errors, updateFormData, updateNestedFormData }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.buyerInfo.firstName}
                onChange={(e) => updateFormData('buyerInfo', 'firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.buyerInfo.lastName}
                onChange={(e) => updateFormData('buyerInfo', 'lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.buyerInfo.email}
              onChange={(e) => updateFormData('buyerInfo', 'email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.buyerInfo.phone}
              onChange={(e) => updateFormData('buyerInfo', 'phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.buyerInfo.address.street}
              onChange={(e) => updateNestedFormData('buyerInfo', 'address', 'street', e.target.value)}
              className={errors.street ? 'border-red-500' : ''}
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.buyerInfo.address.city}
                onChange={(e) => updateNestedFormData('buyerInfo', 'address', 'city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.buyerInfo.address.state}
                onChange={(e) => updateNestedFormData('buyerInfo', 'address', 'state', e.target.value)}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.buyerInfo.address.zipCode}
                onChange={(e) => updateNestedFormData('buyerInfo', 'address', 'zipCode', e.target.value)}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.buyerInfo.address.country}
                onChange={(e) => updateNestedFormData('buyerInfo', 'address', 'country', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Payment Information Step Component
function PaymentInformationStep({ formData, errors, paymentMethods, updateFormData, updateNestedFormData }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={formData.paymentInfo.method} onValueChange={(value) => updateFormData('paymentInfo', 'method', value)}>
            <TabsList className="grid w-full grid-cols-3">
              {paymentMethods.map((method) => (
                <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                  <method.icon className="w-4 h-4" />
                  {method.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="credit_card" className="space-y-4 mt-4">
              <PaymentCardForm formData={formData} errors={errors} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="debit_card" className="space-y-4 mt-4">
              <PaymentCardForm formData={formData} errors={errors} updateFormData={updateFormData} />
            </TabsContent>

            <TabsContent value="paypal" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <p className="text-lg font-semibold">PayPal Payment</p>
                <p className="text-gray-600">You will be redirected to PayPal to complete your payment</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Payment Card Form Component
function PaymentCardForm({ formData, errors, updateFormData }) {
  return (
    <>
      <div>
        <Label htmlFor="cardNumber">Card Number *</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.paymentInfo.cardNumber}
          onChange={(e) => updateFormData('paymentInfo', 'cardNumber', e.target.value)}
          className={errors.cardNumber ? 'border-red-500' : ''}
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="expiryMonth">Month *</Label>
          <Input
            id="expiryMonth"
            placeholder="MM"
            value={formData.paymentInfo.expiryMonth}
            onChange={(e) => updateFormData('paymentInfo', 'expiryMonth', e.target.value)}
            className={errors.expiryMonth ? 'border-red-500' : ''}
          />
          {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
        </div>
        <div>
          <Label htmlFor="expiryYear">Year *</Label>
          <Input
            id="expiryYear"
            placeholder="YYYY"
            value={formData.paymentInfo.expiryYear}
            onChange={(e) => updateFormData('paymentInfo', 'expiryYear', e.target.value)}
            className={errors.expiryYear ? 'border-red-500' : ''}
          />
          {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
        </div>
        <div>
          <Label htmlFor="cvv">CVV *</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={formData.paymentInfo.cvv}
            onChange={(e) => updateFormData('paymentInfo', 'cvv', e.target.value)}
            className={errors.cvv ? 'border-red-500' : ''}
          />
          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="cardholderName">Cardholder Name *</Label>
        <Input
          id="cardholderName"
          placeholder="Name as it appears on card"
          value={formData.paymentInfo.cardholderName}
          onChange={(e) => updateFormData('paymentInfo', 'cardholderName', e.target.value)}
          className={errors.cardholderName ? 'border-red-500' : ''}
        />
        {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
      </div>
    </>
  );
}

// Review Step Component
function ReviewStep({ formData, errors, artwork, total, updateFormData }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={(e) => updateFormData('agreedToTerms', null, e.target.checked)}
              className={errors.agreedToTerms ? 'border-red-500' : ''}
            />
            <Label htmlFor="agreedToTerms" className="text-sm">
              I agree to the <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a> *
            </Label>
          </div>
          {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={(e) => updateFormData('subscribeNewsletter', null, e.target.checked)}
            />
            <Label htmlFor="subscribeNewsletter" className="text-sm">
              Subscribe to our newsletter for art updates and exclusive offers
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Secure Purchase</span>
        </div>
        <p className="text-sm text-green-700">
          Your payment information is encrypted and secure. This artwork will be marked as sold immediately upon successful payment.
        </p>
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ artwork, deliveryOptions, total }) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{artwork.title}</h4>
            <p className="text-xs text-gray-600">by {artwork.artist}</p>
            <Badge variant="outline" className="text-xs mt-1">{artwork.category}</Badge>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Artwork Price</span>
            <span>${artwork.price.toLocaleString()}</span>
          </div>
          {deliveryOptions.insurance && (
            <div className="flex justify-between text-sm">
              <span>Insurance</span>
              <span>$50</span>
            </div>
          )}
          {deliveryOptions.method === 'express' && (
            <div className="flex justify-between text-sm">
              <span>Express Shipping</span>
              <span>$25</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Authenticity Guaranteed</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Certificate of authenticity included with purchase
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Purchase Success Component
function PurchaseSuccess({ artwork, onClose }) {
  return (
    <div className="text-center py-8">
      <div className="success-animation">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
      </div>
      <h2 className="text-2xl font-bold text-green-600 mb-2">Purchase Successful!</h2>
      <p className="text-gray-600 mb-4">
        Thank you for purchasing "{artwork.title}". You will receive a confirmation email shortly.
      </p>
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-green-800">
          This artwork is now marked as SOLD in the gallery and will be removed from available inventory.
        </p>
      </div>
      <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
        Continue Browsing
      </Button>
    </div>
  );
}

