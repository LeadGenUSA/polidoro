import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface Recipient {
  email: string;
  name?: string;
  address?: string;
}

interface SendResult {
  email: string;
  ok: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@,;<>"']+@[^\s@,;<>"']+\.[^\s@,;<>"']+$/;

const looksLikeEmailHeading = (heading: string) =>
  heading.toLowerCase().replace(/[\s_\-./#]+/g, '').includes('email');

const asString = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Pulls unique recipients out of the given submission records. */
export const extractRecipients = (
  records: Record<string, unknown>[]
): { recipients: Recipient[]; skipped: number } => {
  const map = new Map<string, Recipient>();
  let skipped = 0;

  records.forEach((record) => {
    const candidates: string[] = [];
    const top = asString(record.email);
    if (top) candidates.push(top);

    const extra = record.extra_fields;
    if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
      Object.entries(extra as Record<string, unknown>).forEach(([heading, value]) => {
        const v = asString(value);
        if (v && looksLikeEmailHeading(heading)) candidates.push(v);
      });
    }

    const valid = candidates
      .flatMap((c) => c.split(/[,;]/))
      .map((c) => c.trim())
      .filter((c) => EMAIL_RE.test(c));

    if (valid.length === 0) {
      skipped += 1;
      return;
    }

    const name =
      asString(record.customer_name) || asString(record.name) || asString(record.full_name);
    const address = asString(record.street_address) || asString(record.address);

    valid.forEach((email) => {
      const key = email.toLowerCase();
      if (!map.has(key)) map.set(key, { email, name, address });
    });
  });

  return { recipients: Array.from(map.values()), skipped };
};

interface EmailResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  records: Record<string, unknown>[];
}

export const EmailResultsDialog = ({ open, onOpenChange, records }: EmailResultsDialogProps) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [step, setStep] = useState<'compose' | 'confirm' | 'done'>('compose');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<SendResult[]>([]);

  const { recipients, skipped } = useMemo(() => extractRecipients(records), [records]);

  const reset = () => {
    setStep('compose');
    setResults([]);
    setSending(false);
  };

  const close = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const preview = (text: string) => {
    const first = recipients[0];
    if (!first) return text;
    return text
      .replace(/\{\{\s*customer_name\s*\}\}/gi, first.name || '')
      .replace(/\{\{\s*address\s*\}\}/gi, first.address || '');
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-outlook-bulk', {
        body: { subject, body, recipients },
      });

      if (error) {
        let details = error.message;
        if (error instanceof FunctionsHttpError) {
          const raw = await error.context.text();
          try {
            details = JSON.parse(raw).error ?? raw;
          } catch {
            details = raw;
          }
        }
        toast.error(details || 'Sending failed');
        setSending(false);
        return;
      }

      setResults((data?.results as SendResult[]) ?? []);
      setStep('done');
      const sent = data?.sent ?? 0;
      const failed = data?.failed ?? 0;
      if (failed > 0) {
        toast.warning(`${sent} sent, ${failed} failed`);
      } else {
        toast.success(`${sent} ${sent === 1 ? 'email' : 'emails'} sent`);
      }
    } catch (e) {
      toast.error((e as Error).message || 'Sending failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Results
          </DialogTitle>
          <DialogDescription>
            Sends from the connected Outlook 365 mailbox. Each person receives their own copy.
          </DialogDescription>
        </DialogHeader>

        {step === 'compose' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">
                {recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'}
              </Badge>
              {skipped > 0 && (
                <span className="text-muted-foreground">
                  {skipped} {skipped === 1 ? 'record has' : 'records have'} no email address and will be skipped
                </span>
              )}
            </div>

            {recipients.length > 0 && (
              <ScrollArea className="h-24 rounded-md border p-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  {recipients.map((r) => (
                    <div key={r.email}>{r.email}</div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={255}
                placeholder="A quick update from Big City Plumbing and Heating"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                maxLength={20000}
                placeholder={'Hi {{customer_name}},\n\n...'}
              />
              <p className="text-xs text-muted-foreground">
                Optional placeholders: <code>{'{{customer_name}}'}</code> and <code>{'{{address}}'}</code>
              </p>
            </div>

            {recipients[0] && (subject || body) && (
              <div className="rounded-md border bg-muted/40 p-3 text-xs">
                <p className="font-medium mb-1">Preview for {recipients[0].email}</p>
                <p className="font-medium">{preview(subject)}</p>
                <p className="whitespace-pre-wrap text-muted-foreground">{preview(body)}</p>
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-2 text-sm">
            <p>
              Send this message to <strong>{recipients.length}</strong>{' '}
              {recipients.length === 1 ? 'recipient' : 'recipients'}?
            </p>
            <p className="text-muted-foreground">
              Each recipient gets a separate email, so nobody sees the other addresses.
            </p>
          </div>
        )}

        {step === 'done' && (
          <ScrollArea className="max-h-72">
            <div className="space-y-1 text-sm pr-3">
              {results.map((r) => (
                <div key={r.email} className="flex items-start gap-2">
                  {r.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <span className="break-all">
                    {r.email}
                    {!r.ok && r.error ? ` — ${r.error}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          {step === 'compose' && (
            <>
              <Button variant="outline" onClick={() => close(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                disabled={recipients.length === 0 || !subject.trim() || !body.trim()}
              >
                Continue
              </Button>
            </>
          )}
          {step === 'confirm' && (
            <>
              <Button variant="outline" onClick={() => setStep('compose')} disabled={sending}>
                Back
              </Button>
              <Button onClick={handleSend} disabled={sending} className="gap-2">
                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                Send {recipients.length} {recipients.length === 1 ? 'email' : 'emails'}
              </Button>
            </>
          )}
          {step === 'done' && <Button onClick={() => close(false)}>Close</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
