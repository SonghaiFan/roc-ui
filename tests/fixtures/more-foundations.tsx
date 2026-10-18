import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./components/roc/alert";
import { Avatar, AvatarImage, AvatarFallback } from "./components/roc/avatar";
import { Progress } from "./components/roc/progress";
import { Skeleton } from "./components/roc/skeleton";
import { Toggle } from "./components/roc/toggle";
import { ToggleGroup, ToggleGroupItem } from "./components/roc/toggle-group";
import { RadioGroup, RadioGroupItem } from "./components/roc/radio-group";
import { ScrollArea } from "./components/roc/scroll-area";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/roc/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/roc/pagination";
export function MoreFoundationConsumer() {
  const [progress, setProgress] = useState<number | null>(50),
    [page, setPage] = useState(1);
  return (
    <>
      <section>
        <Alert>
          <AlertTitle>Independent notice</AlertTitle>
          <AlertDescription>Kept with the source.</AlertDescription>
        </Alert>
      </section>
      <section>
        <Avatar>
          <AvatarImage
            src="data:image/png;base64,invalid"
            alt="Independent portrait"
          />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
      </section>
      <section>
        <Progress
          aria-label="Independent progress"
          value={progress}
          max={200}
        />
        <button onClick={() => setProgress((v) => (v === null ? 50 : null))}>
          Toggle unknown progress
        </button>
      </section>
      <section>
        <Skeleton
          data-testid="independent-skeleton"
          style={{ width: 160, height: 24 }}
        />
      </section>
      <section>
        <Toggle aria-label="Independent toggle">Bold</Toggle>
      </section>
      <section>
        <ToggleGroup
          type="multiple"
          aria-label="Independent formats"
          defaultValue={["a"]}
        >
          <ToggleGroupItem value="a">Format A</ToggleGroupItem>
          <ToggleGroupItem value="b">Format B</ToggleGroupItem>
        </ToggleGroup>
      </section>
      <section>
        <RadioGroup aria-label="Independent choice" defaultValue="a">
          <label>
            <RadioGroupItem value="a" />
            Choice A
          </label>
          <label>
            <RadioGroupItem value="b" />
            Choice B
          </label>
          <label>
            <RadioGroupItem value="c" disabled />
            Choice C
          </label>
        </RadioGroup>
      </section>
      <section>
        <ScrollArea
          style={{ height: 120, width: 260 }}
          viewportProps={{ role: "region", "aria-label": "Independent notes" }}
        >
          <textarea
            aria-label="Independent scroll draft"
            defaultValue="Keep this node"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>Note {i + 1}</p>
          ))}
        </ScrollArea>
      </section>
      <section>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#root">Root</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Independent page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
      <section>
        <Pagination aria-label="Independent pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled href="?page=0" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="?page=1"
                isActive={page === 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(1);
                }}
              >
                Page one
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="?page=2"
                isActive={page === 2}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(2);
                }}
              >
                Page two
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="?page=2"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(2);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
}
