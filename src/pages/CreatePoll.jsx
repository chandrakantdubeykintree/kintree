import AsyncComponent from "@/components/async-component";
import { route_foreroom } from "@/constants/routeEnpoints";
import { NavLink } from "react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useCreatePost } from "@/hooks/usePosts";
import { useNavigate } from "react-router";
import CustomDateMonthYearPicker from "@/components/custom-ui/custom-dateMonthYearPicker";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const navigate = useNavigate();

  const {
    mutate: createPost,
    isLoading: isCreatingPost,
    isError,
    error,
  } = useCreatePost();

  const addOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removeOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const isValidPoll = () => {
    if (!question.trim() || question.length < 5) {
      toast.error("Question must be at least 5 characters long");
      return false;
    }

    if (pollOptions.some((option) => !option.trim())) {
      toast.error("All poll options must be filled");
      return false;
    }

    if (endDate < startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidPoll()) return;

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    const postData = {
      type: "poll",
      question: question.trim(),
      poll_options: pollOptions.map((opt) => opt.trim()),
      start_at: format(startDate, "yyyy-MM-dd"),
      end_at: format(adjustedEndDate, "yyyy-MM-dd HH:mm:ss"),
      is_multi_vote_allowed: 0,
    };

    createPost(postData, {
      onSuccess: () => {
        navigate("/", {
          state: { newPost: true },
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create poll");
      },
    });
  };
  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 pb-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to={route_foreroom}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            Back to Foreroom
          </NavLink>
        </div>
        <AsyncComponent>
          <Card className="w-full rounded-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-xl font-bold">Create Poll</CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    rows="4"
                    placeholder="Type your question here."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                  {question.length > 0 && question.length < 5 && (
                    <p className="text-sm text-red-500">
                      Question must be at least 5 characters long
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Options</Label>
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        required
                        maxLength={50}
                        className="rounded-full h-10 md:h-12 px-4 md:px-6"
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="rounded-full h-10 md:h-12 px-4 md:px-6"
                        >
                          <Trash2 className="h-4 w-4 hover:fill-red-500 hover:text-red-500 hover:cursor-pointer hover:bg-red-500/10 rounded-full" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="rounded-full h-10 md:h-12 px-4 md:px-6"
                  >
                    Add Option
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Start Date</Label>
                    <CustomDateMonthYearPicker
                      value={startDate}
                      onChange={setStartDate}
                      placeholder="Select start date"
                      minDate={new Date()}
                      className="rounded-full h-10 md:h-12 px-4 md:px-6"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>End Date</Label>
                    <CustomDateMonthYearPicker
                      value={endDate}
                      onChange={setEndDate}
                      placeholder="Select end date"
                      minDate={startDate}
                      className="rounded-full h-10 md:h-12 px-4 md:px-6"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  className="rounded-full h-10 md:h-12 px-4 md:px-6"
                >
                  Create Poll
                </Button>
              </CardFooter>
            </form>
          </Card>
        </AsyncComponent>
      </div>
    </AsyncComponent>
  );
}
