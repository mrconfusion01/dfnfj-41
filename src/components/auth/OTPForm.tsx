
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Timer } from "lucide-react";

interface OTPFormProps {
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
  onBack?: () => void;
  timeRemaining: number;
  formatTimeRemaining: (seconds: number) => string;
  otpSent: boolean;
}

export const OTPForm = ({ 
  onSubmit, 
  onResend, 
  isLoading, 
  onBack, 
  timeRemaining, 
  formatTimeRemaining,
  otpSent 
}: OTPFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const otp = (form.elements.namedItem('otp') as HTMLInputElement).value;
    await onSubmit(otp);
  };

  const isCodeExpired = otpSent && timeRemaining === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Enter verification code
        </h2>
        <p className="text-sm text-gray-600">
          Please enter the verification code sent to your email
        </p>
        {otpSent && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Timer className="h-4 w-4 text-blue-500" />
            {timeRemaining > 0 ? (
              <span className="text-blue-600">
                Code expires in: {formatTimeRemaining(timeRemaining)}
              </span>
            ) : (
              <span className="text-red-500">Code has expired</span>
            )}
          </div>
        )}
      </div>

      <Input
        id="otp"
        name="otp"
        type="text"
        placeholder="Enter code"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
          disabled={isLoading || isCodeExpired}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onResend}
          disabled={timeRemaining > 0 || isLoading}
          className="w-full h-9 rounded-full text-sm"
        >
          {timeRemaining > 0 
            ? `Resend code in ${formatTimeRemaining(timeRemaining)}` 
            : "Resend code"}
        </Button>

        {isCodeExpired && (
          <p className="text-center text-sm text-red-500">
            This code has expired. Please request a new one using the Resend button.
          </p>
        )}
      </div>
    </form>
  );
};
