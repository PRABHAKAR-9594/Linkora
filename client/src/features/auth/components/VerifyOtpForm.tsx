import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema } from "../validation";
import type { VerifyOtpPayload } from "../types";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Loader2, ShieldCheck } from "lucide-react";

import { useVerifyOtp, useResendOtp } from "../hooks/useAuth";
import { useEffect, useState } from "react";

const VerifyOtp: React.FC = () => {
  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: resending } = useResendOtp();

  const form = useForm<VerifyOtpPayload>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    resendOtp();
    setTimer(30);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted px-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              Verify Your Email
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              We've sent a 6-digit code to your email
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => verifyOtp(values))}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-4">
                    <FormLabel className="text-foreground">
                      Enter OTP Code
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                          <InputOTPSlot
                            index={3}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                          <InputOTPSlot
                            index={4}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                          <InputOTPSlot
                            index={5}
                            className="h-12 w-12 text-lg border-input bg-background"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                disabled={form.watch("otp").length !== 6 || verifying}
              >
                {verifying && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {verifying ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive the code?
            </p>
            <div className="text-center text-sm text-muted-foreground">
              {timer > 0 ? (
                <p>
                  Resend OTP in <span className="font-semibold">{timer}s</span>
                </p>
              ) : (
                <Button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                >
                  {resending ? "Resending OTP..." : "Resend OTP"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
