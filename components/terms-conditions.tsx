"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Shield, AlertTriangle } from "lucide-react"

interface TermsConditionsProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (acceptedTerms: boolean, acceptedAdult: boolean) => void
  showAdultContent?: boolean
}

export function TermsConditions({ isOpen, onClose, onAccept, showAdultContent = false }: TermsConditionsProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedAdult, setAcceptedAdult] = useState(false)

  if (!isOpen) return null

  const handleAccept = () => {
    if (acceptedTerms && (!showAdultContent || acceptedAdult)) {
      onAccept(acceptedTerms, acceptedAdult)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Terms and Conditions</span>
            </CardTitle>
            <CardDescription>Please read and accept our terms to continue</CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <ScrollArea className="h-96 w-full border rounded-lg p-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using ArtVerse 3D ("the Platform"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">2. User Content and Intellectual Property</h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  You retain ownership of all intellectual property rights in the content you upload to the Platform. By
                  uploading content, you grant ArtVerse a non-exclusive, worldwide, royalty-free license to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Display your artwork in 3D galleries</li>
                  <li>Process payments for artwork sales</li>
                  <li>Provide thumbnail previews in gallery listings</li>
                  <li>Enable sharing and discovery features</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">3. Content Guidelines</h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  All content uploaded to the Platform must comply with our community guidelines:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Content must be original or you must have proper licensing rights</li>
                  <li>No copyrighted material without permission</li>
                  <li>No hate speech, harassment, or discriminatory content</li>
                  <li>Adult content must be properly flagged and age-restricted</li>
                  <li>No illegal, harmful, or malicious content</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">4. Payment and Fees</h3>
                <p className="text-gray-600 leading-relaxed">
                  ArtVerse charges a 10% commission on all artwork sales. Payments are processed securely through our
                  payment partners. Artists receive 90% of the sale price, minus any applicable taxes or payment
                  processing fees.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">5. Privacy and Data Protection</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to protecting your privacy. Your personal information is encrypted and stored
                  securely. We do not sell or share your personal data with third parties without your consent, except
                  as required by law or to process transactions.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">6. Account Termination</h3>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to terminate accounts that violate our terms of service. Upon termination, you
                  will lose access to your gallery, but you retain ownership of your uploaded content.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">7. Limitation of Liability</h3>
                <p className="text-gray-600 leading-relaxed">
                  ArtVerse is provided "as is" without warranties. We are not liable for any damages arising from the
                  use of the Platform, including but not limited to loss of data, revenue, or profits.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">8. Changes to Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes
                  via email or platform notifications.
                </p>
              </section>
            </div>
          </ScrollArea>

          {/* Adult Content Warning */}
          {showAdultContent && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Adult Content Notice</h4>
                    <p className="text-orange-800 text-sm mb-3">
                      This gallery may contain adult content including artistic nudity, mature themes, or content
                      intended for viewers 18 years and older. By proceeding, you confirm that:
                    </p>
                    <ul className="list-disc list-inside text-orange-800 text-sm space-y-1 ml-4">
                      <li>You are at least 18 years old</li>
                      <li>You consent to viewing adult content</li>
                      <li>Such content is legal in your jurisdiction</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label htmlFor="accept-terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                I have read and agree to the Terms and Conditions, Privacy Policy, and Community Guidelines
              </label>
            </div>

            {showAdultContent && (
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept-adult"
                  checked={acceptedAdult}
                  onCheckedChange={(checked) => setAcceptedAdult(checked as boolean)}
                />
                <label htmlFor="accept-adult" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I am 18 years or older and consent to viewing adult content
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!acceptedTerms || (showAdultContent && !acceptedAdult)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Accept and Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
