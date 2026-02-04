import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Link as LinkIcon, Code, Copy, CheckCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateLinkGeneratorProps {
  baseUrl?: string;
}

export function UpdateLinkGenerator({ baseUrl }: UpdateLinkGeneratorProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [copiedStandalone, setCopiedStandalone] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const actualBaseUrl = baseUrl || window.location.origin + window.location.pathname;
  
  // Generate URLs
  const standaloneUrl = employeeId 
    ? `${actualBaseUrl}?mode=update&employeeId=${employeeId}`
    : `${actualBaseUrl}?mode=update`;
    
  const embedUrl = employeeId
    ? `${actualBaseUrl}?mode=update&embed=true&employeeId=${employeeId}`
    : `${actualBaseUrl}?mode=update&embed=true`;

  // Generate QR Code URL (using a free QR code API)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(standaloneUrl)}`;

  // Generate iframe embed code
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="Employee Details Update Form"
></iframe>`;

  const copyToClipboard = (text: string, type: 'standalone' | 'embed' | 'iframe') => {
    navigator.clipboard.writeText(text);
    
    if (type === 'standalone') {
      setCopiedStandalone(true);
      setTimeout(() => setCopiedStandalone(false), 2000);
    } else if (type === 'embed') {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
    
    toast.success('Copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <LinkIcon size={24} className="text-primary" weight="fill" />
          </div>
          <div>
            <CardTitle>Generate Update Link</CardTitle>
            <CardDescription>
              Create shareable links for employees to update their details
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Employee ID Input */}
        <div className="space-y-2">
          <Label htmlFor="emp-id-input">Employee ID (Optional)</Label>
          <Input
            id="emp-id-input"
            type="text"
            placeholder="e.g., BAYN00002"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
          />
          <p className="text-xs text-muted-foreground">
            Pre-fill the employee ID in the form. Leave empty for a general link.
          </p>
        </div>

        <Tabs defaultValue="standalone" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standalone">Direct Link</TabsTrigger>
            <TabsTrigger value="embed">Embedded</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          {/* Standalone URL Tab */}
          <TabsContent value="standalone" className="space-y-4">
            <Alert>
              <LinkIcon size={16} weight="fill" />
              <AlertDescription>
                Share this link directly with employees via email, WhatsApp, or SMS. They can open it in their browser.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Standalone Update Link</Label>
              <div className="flex gap-2">
                <Input
                  value={standaloneUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(standaloneUrl, 'standalone')}
                >
                  {copiedStandalone ? (
                    <CheckCircle size={16} weight="fill" className="text-green-600" />
                  ) : (
                    <Copy size={16} weight="fill" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Usage Example:</h4>
              <p className="text-xs text-muted-foreground">
                Send via WhatsApp: "Please update your contact details here: {standaloneUrl}"
              </p>
            </div>
          </TabsContent>

          {/* Embedded Tab */}
          <TabsContent value="embed" className="space-y-4">
            <Alert>
              <Code size={16} weight="fill" />
              <AlertDescription>
                Embed this form in your company intranet or portal. Employees won't see the URL.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Embed URL</Label>
              <div className="flex gap-2">
                <Input
                  value={embedUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(embedUrl, 'embed')}
                >
                  {copiedEmbed ? (
                    <CheckCircle size={16} weight="fill" className="text-green-600" />
                  ) : (
                    <Copy size={16} weight="fill" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>iframe Embed Code</Label>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{iframeCode}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                >
                  {copiedIframe ? (
                    <>
                      <CheckCircle size={14} weight="fill" className="text-green-600 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} weight="fill" className="mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">How to use:</h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy the iframe code above</li>
                <li>Paste it into your intranet HTML page</li>
                <li>Employees will see the form embedded without URL visibility</li>
              </ol>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4">
            <Alert>
              <QrCode size={16} weight="fill" />
              <AlertDescription>
                Print this QR code and place it in your office. Employees can scan to access the form.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col items-center space-y-4">
              <div className="border rounded-lg p-4 bg-white">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for employee update form"
                  className="w-64 h-64"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Download QR code
                  const link = document.createElement('a');
                  link.href = qrCodeUrl;
                  link.download = `employee-update-qr-${employeeId || 'general'}.png`;
                  link.click();
                }}
              >
                Download QR Code
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Benefits:</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>No URL visible - employees just scan and access</li>
                <li>Can be printed and posted in common areas</li>
                <li>Easy access from mobile devices</li>
                <li>Professional and modern solution</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <LinkIcon size={16} weight="fill" className="text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Security Note:</strong> All forms require employee ID and date of birth verification before allowing updates.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
