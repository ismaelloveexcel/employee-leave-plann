import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EnvelopeSimple, Check, X, Eye, EyeSlash } from '@phosphor-icons/react';
import { EmailNotification } from '@/lib/email-service';

interface EmailNotificationCardProps {
  notification: EmailNotification | null;
  managerEmail?: string;
  showPreview?: boolean;
}

export function EmailNotificationCard({ notification, managerEmail, showPreview = true }: EmailNotificationCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!notification && !managerEmail) {
    return (
      <Alert className="bg-muted/30">
        <EnvelopeSimple size={20} className="text-muted-foreground" />
        <AlertDescription className="text-sm">
          No manager email configured. Your request will be submitted but no email notification will be sent.
        </AlertDescription>
      </Alert>
    );
  }

  if (!notification) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <EnvelopeSimple size={20} className="text-primary" weight="fill" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Email Notification Sent</CardTitle>
              <CardDescription className="text-xs mt-1">
                Your manager has been notified of your leave request
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Check size={12} weight="bold" className="mr-1" />
            Sent
          </Badge>
        </div>
      </CardHeader>
      
      {showPreview && (
        <>
          <Separator />
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-medium text-foreground">{notification.to}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Preview:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="h-8 gap-2 text-xs"
                >
                  {expanded ? (
                    <>
                      <EyeSlash size={14} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={14} />
                      Show
                    </>
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg border bg-card p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Subject:</div>
                        <div className="text-sm font-medium">{notification.subject}</div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Message:</div>
                        <ScrollArea className="h-[200px] rounded-md">
                          <pre className="text-xs whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
                            {notification.body}
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

interface EmailNotificationListProps {
  notifications: EmailNotification[];
}

export function EmailNotificationList({ notifications }: EmailNotificationListProps) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <EnvelopeSimple size={20} weight="fill" />
        Recent Email Notifications
      </h3>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm">{notification.subject}</CardTitle>
                      <CardDescription className="text-xs">
                        To: {notification.to}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
