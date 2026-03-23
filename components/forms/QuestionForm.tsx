"use client";
import { AskQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import TagCard from "../cards/TagCard";

const QuestionForm = () => {
  const Editor = dynamic(() => import("@/components/editor"), {
    // Make sure we turn SSR off
    ssr: false,
  });
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

 const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    console.log(field, e);
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = () => {};

  return (
    <FieldGroup>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => (
            <Field className="flex w-full flex-col">
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
              />
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you&apos;re as king a question
              </FieldDescription>
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <Field className="flex w-full flex-col">
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem {""}{" "}
                <span className="text-primary-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FieldContent>
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FieldDescription>
            </Field>
          )}
        />
        <Controller
          name="tags"
          control={form.control}
          render={({ field }) => (
            <Field className="flex w-full flex-col gap-3">
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FieldLabel>
              <Input
                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                placeholder="Add tags..."
                onKeyDown={(e) => handleInputKeyDown(e, field)}
              />
              {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field?.value?.map((tag: string) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FieldDescription>
            </Field>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
          >
            Ask A Question
          </Button>
        </div>
      </form>
    </FieldGroup>
  );
};

export default QuestionForm;
