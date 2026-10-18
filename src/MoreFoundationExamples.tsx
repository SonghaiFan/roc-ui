import { CatalogExample } from "./CatalogExamples";
import { useState } from "react";
import {
  Info,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../registry/roc/alert";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "../registry/roc/avatar";
import { Progress } from "../registry/roc/progress";
import { Skeleton } from "../registry/roc/skeleton";
import { Toggle } from "../registry/roc/toggle";
import { ToggleGroup, ToggleGroupItem } from "../registry/roc/toggle-group";
import { RadioGroup, RadioGroupItem } from "../registry/roc/radio-group";
import { ScrollArea } from "../registry/roc/scroll-area";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../registry/roc/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../registry/roc/pagination";
import { Button } from "../registry/roc/button";
import { Textarea } from "../registry/roc/textarea";
const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#dedbd4"/><circle cx="40" cy="30" r="15" fill="#8d8980"/><path d="M9 80a31 31 0 0 1 62 0" fill="#8d8980"/></svg>')}`;
const pages = [
  "Collect the observations that matter.",
  "Keep the context beside the work.",
  "Return to the same thought later.",
];
export function MoreFoundationExample({ id }: { id: string }) {
  const [hasImage, setHasImage] = useState(false),
    [progress, setProgress] = useState(35),
    [unknown, setUnknown] = useState(false),
    [loaded, setLoaded] = useState(false),
    [bold, setBold] = useState(false),
    [italic, setItalic] = useState(false),
    [alignment, setAlignment] = useState("left"),
    [format, setFormat] = useState(["italic"]),
    [visibility, setVisibility] = useState("private"),
    [page, setPage] = useState(1),
    [location, setLocation] = useState("Field notes");
  if (id === "alert")
    return (
      <div className="foundation-demo">
        <Alert>
          <Info />
          <AlertTitle>Changes stay with this draft</AlertTitle>
          <AlertDescription>
            You can leave this view and pick up where you stopped.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Connection unavailable</AlertTitle>
          <AlertDescription>Your local draft is still here.</AlertDescription>
        </Alert>
      </div>
    );
  if (id === "avatar")
    return (
      <div className="foundation-demo">
        <div className="foundation-row">
          <Avatar size="lg" aria-label="Alex Morgan">
            {hasImage && <AvatarImage src={portrait} alt="Alex Morgan" />}
            <AvatarFallback>AM</AvatarFallback>
            <AvatarBadge aria-label="Available" />
          </Avatar>
          <div>
            <strong>Alex Morgan</strong>
            <div className="foundation-hint">
              A reserved place for a person.
            </div>
          </div>
        </div>
        <div className="foundation-row">
          <AvatarGroup aria-label="Contributors">
            {["JL", "SK", "AR"].map((name) => (
              <Avatar key={name}>
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount aria-label="3 more contributors">
              +3
            </AvatarGroupCount>
          </AvatarGroup>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setHasImage((v) => !v)}
          >
            {hasImage ? "Show initials" : "Load portrait"}
          </Button>
        </div>
      </div>
    );
  if (id === "progress")
    return (
      <div className="foundation-demo">
        <div
          className="foundation-row"
          style={{ justifyContent: "space-between" }}
        >
          <span>Preparing collection</span>
          <output aria-live="polite">
            {unknown ? "Working…" : `${progress}%`}
          </output>
        </div>
        <Progress
          aria-label="Collection progress"
          value={unknown ? null : progress}
        />
        <div className="foundation-row">
          <Button
            size="sm"
            variant="outline"
            disabled={unknown}
            onClick={() =>
              setProgress((v) => (v >= 100 ? 0 : Math.min(100, v + 25)))
            }
          >
            Advance progress
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-pressed={unknown}
            onClick={() => setUnknown((v) => !v)}
          >
            Unknown duration
          </Button>
        </div>
      </div>
    );
  if (id === "skeleton")
    return (
      <div className="foundation-demo">
        <div className="foundation-loading-sample" aria-busy={!loaded}>
          <div className="foundation-loading-avatar">
            {loaded ? (
              <Avatar size="lg">
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            )}
          </div>
          <div className="foundation-loading-copy">
            {loaded ? (
              <>
                <strong>Field notes</strong>
                <span className="foundation-hint">
                  A quiet place for observations.
                </span>
              </>
            ) : (
              <>
                <Skeleton style={{ width: "62%", height: 18 }} />
                <Skeleton style={{ width: "92%", height: 16 }} />
              </>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setLoaded((v) => !v)}
        >
          {loaded ? "Show placeholder" : "Show content"}
        </Button>
        <span className="foundation-hint">
          Reserved space, without a looping shimmer.
        </span>
      </div>
    );
  if (id === "toggle")
    return (
      <div className="foundation-demo">
        <div className="foundation-row">
          <Toggle
            aria-label="Bold text"
            pressed={bold}
            onPressedChange={setBold}
            variant="outline"
          >
            <Bold />
          </Toggle>
          <Toggle
            aria-label="Italic text"
            variant="outline"
            pressed={italic}
            onPressedChange={setItalic}
          >
            <Italic />
          </Toggle>
          <Toggle aria-label="Underline text" variant="outline" disabled>
            <Underline />
          </Toggle>
        </div>
        <Textarea
          aria-label="Toggle draft"
          defaultValue="A thought with a little emphasis."
          style={{
            fontWeight: bold ? 600 : 400,
            fontStyle: italic ? "italic" : "normal",
          }}
        />
      </div>
    );
  if (id === "toggle-group")
    return (
      <div className="foundation-demo">
        <ToggleGroup
          type="single"
          aria-label="Text alignment"
          value={alignment}
          onValueChange={(v) => {
            if (v) setAlignment(v);
          }}
          variant="outline"
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
        <Textarea
          aria-label="Alignment draft"
          defaultValue="The same words, another alignment."
          style={{
            textAlign: alignment as "left" | "center" | "right",
            fontWeight: format.includes("bold") ? 600 : 400,
            fontStyle: format.includes("italic") ? "italic" : "normal",
          }}
        />
        <ToggleGroup
          type="multiple"
          aria-label="Text formatting"
          value={format}
          onValueChange={setFormat}
          spacing={1}
        >
          <ToggleGroupItem value="bold" aria-label="Use bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Use italic">
            <Italic />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  if (id === "radio-group")
    return (
      <div className="foundation-demo">
        <RadioGroup
          aria-label="Collection visibility"
          value={visibility}
          onValueChange={setVisibility}
        >
          {[
            ["private", "Only me"],
            ["team", "People in this workspace"],
            ["public", "Public link"],
          ].map(([value, label]) => (
            <label className="foundation-choice" key={value}>
              <RadioGroupItem value={value} />
              <span>{label}</span>
            </label>
          ))}
        </RadioGroup>
        <span className="foundation-hint">
          One choice. Arrow keys move between options.
        </span>
      </div>
    );
  if (id === "scroll-area")
    return (
      <ScrollArea
        type="always"
        style={{ height: 240 }}
        viewportProps={{ role: "region", "aria-label": "Collection notes" }}
      >
        <div className="foundation-scroll-notes">
          <Textarea
            aria-label="Scroll area draft"
            defaultValue="This note stays in the collection."
          />
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="foundation-scroll-row">
              <span>{String(i + 1).padStart(2, "0")}</span>Observation {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  if (id === "breadcrumb")
    return (
      <div className="foundation-demo">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => setLocation("Workspace")}>
                  Workspace
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => setLocation("Collections")}>
                  Collections
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Field notes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <span className="foundation-hint" role="status">
          {location === "Field notes"
            ? "Keep the path visible at every width."
            : `Preview destination: ${location}`}
        </span>
      </div>
    );
  if (id === "pagination")
    return (
      <div className="foundation-demo">
        <div className="foundation-page-copy" aria-live="polite">
          <span className="foundation-hint">Page {page} of 3</span>
          <p>{pages[page - 1]}</p>
        </div>
        <Pagination aria-label="Collection pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${page - 1}`}
                disabled={page === 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage((v) => Math.max(1, v - 1));
                }}
              />
            </PaginationItem>
            {pages.map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  aria-label={`Page ${i + 1}`}
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${page + 1}`}
                disabled={page === 3}
                onClick={(e) => {
                  e.preventDefault();
                  setPage((v) => Math.min(3, v + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  return <CatalogExample id={id} />;
}
