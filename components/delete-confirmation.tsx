"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType: "gallery" | "artwork"
  warningMessage?: string
}

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  warningMessage,
}: DeleteConfirmationProps) {
  const [confirmationText, setConfirmationText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const expectedText = itemName
  const isConfirmationValid = confirmationText === expectedText

  const handleConfirm = async () => {
    if (!isConfirmationValid) return

    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setIsDeleting(false)
      setConfirmationText("")
    }
  }

  const handleClose = () => {
    setConfirmationText("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-red-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-900">Delete {itemType === "gallery" ? "Gallery" : "Artwork"}</CardTitle>
                <CardDescription className="text-red-700">This action cannot be undone</CardDescription>
              </div>
            </div>
            <Button variant="ghost" onClick={handleClose} className="p-2 hover:bg-red-50">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">Warning</h4>
            <div className="text-red-800 text-sm space-y-2">
              <p>You are about to permanently delete:</p>
              <p className="font-medium bg-red-100 px-2 py-1 rounded">"{itemName}"</p>

              {itemType === "gallery" && (
                <div className="mt-3 space-y-1">
                  <p className="font-medium">This will also delete:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>All artworks in this gallery</li>
                    <li>All uploaded images and files</li>
                    <li>The gallery folder and its contents</li>
                    <li>All associated data and statistics</li>
                  </ul>
                </div>
              )}

              {warningMessage && <p className="mt-2 font-medium">{warningMessage}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium text-gray-900">
              Type the {itemType} name to confirm deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${expectedText}" here`}
              className="border-red-300 focus:border-red-500 focus:ring-red-500"
            />
            <p className="text-xs text-gray-600">
              Expected: <span className="font-mono bg-gray-100 px-1 rounded">{expectedText}</span>
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent" disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isConfirmationValid || isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                `Delete ${itemType === "gallery" ? "Gallery" : "Artwork"}`
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">This action is permanent and cannot be undone</p>
        </CardContent>
      </Card>
    </div>
  )
}
