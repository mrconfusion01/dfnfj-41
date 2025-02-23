
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface SignUpFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      dob: (form.elements.namedItem('dob') as HTMLInputElement).value,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          type="text"
          placeholder="First name"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />
        <Input
          name="lastName"
          type="text"
          placeholder="Last name"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />
      </div>
      
      <Input
        name="dob"
        type="date"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />
      
      <Input
        name="email"
        type="email"
        placeholder="name@example.com"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />
      
      <Input
        name="password"
        type="password"
        placeholder="Password"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          name="terms"
          className="mt-1 bg-indigo-300 hover:bg-indigo-200"
          required
        />
        <label htmlFor="terms" className="text-xs text-gray-600">
          Agree to our{" "}
          <Link to="#" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link to="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </span>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
};
