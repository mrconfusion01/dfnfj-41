
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OTPFormProps {
  onSubmit: (otp: string) => Promise<void>;
  isLoading: boolean;
}

export const OTPForm = ({ onSubmit, isLoading }: OTPFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const otp = (form.elements.namedItem('otp') as HTMLInputElement).value;
    await onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Enter verification code
        </h2>
        <p className="text-sm text-gray-600">
          Please enter the verification code sent to your email
        </p>
      </div>

      <Input
        id="otp"
        name="otp"
        type="text"
        placeholder="Enter code"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />

      <Button
        type="submit"
        className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
};
