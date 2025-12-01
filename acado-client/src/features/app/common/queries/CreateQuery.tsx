'use client';

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/ShadcnButton";
import { FormItem, Form } from "@/components/ui/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import ApiService from "@services/ApiService";

import { Query } from "@app/types/learner/mailbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils"
import { getDraftQueries } from "@services/common/QueryService";
import { useMyCourses } from "@app/hooks/data/useCourses";
import { useMentors } from "@app/hooks/data/useMentors";

const CreateQuery: React.FC = () => {
  const [params] = useSearchParams();
  const queryId = params.get("id");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [queryType, setQueryType] = useState<"administrator" | "Mentor" | "Faculty">("administrator");
  const { data: mentors = [] } = useMentors();
  const { data: myCourses = [] } = useMyCourses();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      for: "",
      program_id: "",
    },
  });

  useEffect(() => {
    const fetchAndSetDraft = async () => {
      if (!queryId) return;
      try {
        const draftRes = await getDraftQueries();
        const draft = draftRes.data.find((q: Query) => q.id.toString() === queryId);

        if (draft) {
          reset({
            title: draft.title || "",
            description: draft.description || "",
            for: draft.for?.toString() || "",
            program_id: draft.program_id?.toString() || "",
          });
          if (draft.to) setQueryType(draft.to as "administrator" | "Mentor" | "Faculty");
        }
      } catch (error) {
        console.error("Error loading draft", error);
      }
    };

    fetchAndSetDraft();
  }, [queryId, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmission = async (data: any, type: "0" | "1") => {
    if (!data.title || !data.description || ((queryType === "Mentor" || queryType === "Faculty") && !data.for)) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const payload = {
      is_api: "1",
      type,
      title: data.title,
      description: data.description,
      to: queryType,
      mentor: queryType !== "administrator" ? data.for : undefined,
      program_id: data.program_id === "none" ? undefined : data.program_id,
    };

    try {
      if (queryId) {
        await ApiService.fetchDataWithAxios({
          url: "/resend-query",
          method: "post",
          data: { ...payload, id: queryId }
        });
      } else {
        await ApiService.fetchDataWithAxios({
          url: "/create-query",
          method: "post",
          data: payload
        });
      }

      toast.success(type === "1" ? "Query sent!" : "Draft saved!");
      navigate(`/help/mail-box?tab=${type === "1" ? "sent" : "drafts"}`);
    } catch (err) {
      toast.error("Failed to save or send query.");
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Create New Query</h1>
        <p className="text-xs sm:text-sm text-gray-500">Have Any Queries?</p>
      </div>

      <Form className="bg-white dark:bg-black p-5 border rounded-lg">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Send To Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
            <div className="w-full md:w-1/2">
              <FormItem label="Send To">
                <Select
                  value={queryType}
                  onValueChange={(value) => {
                    setQueryType(value as "administrator" | "Mentor" | "Faculty");
                    setValue("for", "");
                  }}
                >
                  <SelectTrigger className="w-full border dark:border-gray-500">
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* {(queryType === "Mentor" || queryType === "Faculty") && (
              <div className="w-full md:w-1/2">
                <FormItem label={`Select ${queryType}`}>
                  <Controller
                    name="for"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Choose ${queryType}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {loading ? (
                            <SelectItem disabled value="loading">Loading...</SelectItem>
                          ) : (
                            mentors
                            ?.slice()
                            .sort((a,b)=>a.name.localeCompare(b.name))
                            .map((person) => (
                              <SelectItem key={person.id} value={person.id.toString()}>
                                {person.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormItem>
              </div>
            )} */}
            {(queryType === "Mentor" || queryType === "Faculty") && (
              <div className="w-full md:w-1/2">
                <FormItem label={`Select ${queryType}`}>
                  <Controller
                    name="for"
                    control={control}
                    render={({ field }) => {
                      const selected = mentors?.find(
                        (m) => String(m.id) === String(field.value)
                      )

                      return (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between border dark:border-gray-500"
                            >
                              {selected ? selected.name : `Choose ${queryType}`}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 border dark:border-gray-500">
                            <Command>
                              <CommandInput placeholder={`Search ${queryType}...`} />
                              <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                  {mentors
                                    ?.slice()
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((person) => (
                                      <CommandItem
                                        key={person.id}
                                        onSelect={() => {
                                          field.onChange(person.id.toString());
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === person.id.toString()
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {person.name}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )
                    }}
                  />
                </FormItem>
              </div>
            )}
          </div>

          {/* Subject Dropdown */}
          <FormItem label="Subject (Optional)" className="md:col-span-2">
            <Controller
              name="program_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                >
                  <SelectTrigger className="w-full border dark:border-gray-500">
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Subject</SelectItem>
                    {myCourses.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id.toString()}>
                        {prog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
          {/* Title */}
          <FormItem label="Title" className="md:col-span-2">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input placeholder="Enter title" {...field} className="border dark:border-gray-500" />
              )}
            />
          </FormItem>

          {/* Description */}
          <FormItem label="Query" className="md:col-span-2">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea rows={4} placeholder="Enter your query" {...field} className="border dark:border-gray-500" />
              )}
            />
          </FormItem>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={handleSubmit((data) => handleSubmission(data, "0"))}>
            Save Draft
          </Button>
          <Button className="text-white dark:text-black" onClick={handleSubmit((data) => handleSubmission(data, "1"))}>
            Send Query
          </Button>
        </div>
        <div>
          {loading && <div className="flex items-center mt-4 text-blue-600 dark:text-blue-400"><Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait ...</div>}
        </div>
      </Form>
    </div>
  );
};

export default CreateQuery;
