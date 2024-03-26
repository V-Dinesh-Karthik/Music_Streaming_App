import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormDescription,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Wave from "../assets/wave-sound.png";

const Register = () => {
  const { toast } = useToast();

  const [passVisibility, setPassVisibility] = useState<boolean>(false);

  const handlePassVisibility = () => {
    setPassVisibility(!passVisibility);
  };

  const formSchema = z.object({
    username: z.string().min(2).max(55),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword != values.password) {
      toast({
        title: "Password do not match!",
        variant: "destructive",
      });
      return;
    }
    const response = await axios.post(
      "http://127.0.0.1:5000/api/auth/register",
      {
        username: values.username,
        email: values.email,
        password: values.password,
      }
    );
    console.log(response);
    if (response.status === 201) {
      toast({
        title: "User Created! Navigating to Login Page",
        variant: "default",
      });
    }
  }
  return (
    <div className="flex justify-center items-center h-screen pl-5 pr-5 pt-10 pb-10">
      <Card className="flex w-full h-full">
        <div className="w-1/2">
          <div className="flex items-center pl-3 pt-3 space-x-3">
            <img src={Wave} width={45} className="" />
            <h1 className="font-semibold tracking-wide text-lg">Harmony</h1>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/2 overflow-auto">
          <Card className="w-full border-hidden">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Register now to Listen to Music!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username.."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email.." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password.."
                            {...field}
                            type={passVisibility ? "text" : "password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Re-enter your password.."
                            {...field}
                            type={passVisibility ? "text" : "password"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-grow w-full items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button type="submit">Register</Button>
                      <div>
                        Have an Account?{" "}
                        <a href="./login" className="hover:underline">
                          {" "}
                          Login here
                        </a>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="button"
                        onClick={handlePassVisibility}
                        variant={"ghost"}
                      >
                        {passVisibility == false ? (
                          <EyeOff></EyeOff>
                        ) : (
                          <Eye></Eye>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default Register;
