// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardTitle,
//   CardHeader,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormLabel,
//   FormMessage,
//   FormItem,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useToast } from "@/components/ui/use-toast";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Eye, EyeOff } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import Wave from "../assets/wave-sound.png";

import { Button } from "@/components/ui/button";
import Spotify from "../assets/spotify.png";

// const Login = () => {
//   const { toast } = useToast();

//   const [passVisibility, setPassVisibility] = useState<boolean>(false);

//   const handlePassVisibility = () => {
//     setPassVisibility(!passVisibility);
//   };

//   const formSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8).max(100),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     const response = await axios.post("http://127.0.0.1:5000/api/auth/login", {
//       email: values.email,
//       password: values.password,
//     });

//     console.log(response);

//     if (response.status === 201) {
//       toast({
//         title: "Logged in",
//         variant: "default",
//       });
//     }
//   }
//   return (
//     <div className="flex justify-center items-center h-screen pl-5 pr-5 pt-10 pb-10">
//       <Card className="flex w-full h-full">
//         <div className="w-1/2 felx flex-col justify-center">
//           <Card className="w-full border-hidden">
//             <CardHeader>
//               <CardTitle>Login</CardTitle>
//               <CardDescription>Welcome Back!</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form
//                   onSubmit={form.handleSubmit(onSubmit)}
//                   className="space-y-3"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Enter your email.." {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Enter your password.."
//                             {...field}
//                             type={passVisibility ? "text" : "password"}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <div className="flex justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Button type="submit">Login</Button>
//                       <div>
//                         Don't Have an Account?{" "}
//                         <a href="./register" className="hover:underline">
//                           {" "}
//                           Register here
//                         </a>
//                       </div>
//                     </div>
//                     <div>
//                       <Button
//                         type="button"
//                         onClick={handlePassVisibility}
//                         variant={"ghost"}
//                       >
//                         {passVisibility == false ? (
//                           <EyeOff></EyeOff>
//                         ) : (
//                           <Eye></Eye>
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </div>
//         <Separator orientation="vertical" />
//         <div className="w-1/2">
//           <div className="flex items-center pl-3 pt-3 space-x-3">
//             <img src={Wave} width={45} className="" />
//             <h1 className="font-semibold tracking-wide text-lg">Harmony</h1>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Login;

const handleClick = () => {
  const clientId = "8fe777d15b174d1f81fb220b15194834";
  const redirectUri = "http://localhost:5173";
  const spotifyAccountsUrl = "https://accounts.spotify.com/authorize";
  const scope = [
    "user-read-private",
    "user-read-email",
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];
  window.location.href = `${spotifyAccountsUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope.join(
    " "
  )}&response_type=token&show_dialog=true`;
};

const Login = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-screen ">
        <Button
          variant={"ghost"}
          className="flex space-x-2"
          onClick={handleClick}
        >
          <img src={Spotify} className="w-9 h-9" />
          <span>Login with Spotify</span>
        </Button>
      </div>
    </div>
  );
};

export default Login;
