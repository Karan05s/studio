import { RegisterForm } from '@/components/auth/register-form';
import { Logo } from '@/components/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="items-center text-center space-y-4">
          <Logo />
          <div className="space-y-1">
            <CardTitle className="font-headline text-2xl">
              Welcome to E-Mitra
            </CardTitle>
            <CardDescription>
              Create an account to get started.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
