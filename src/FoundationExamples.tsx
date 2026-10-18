import { MoreFoundationExample } from "./MoreFoundationExamples";
import { useEffect, useRef, useState } from "react";
import { Button } from "../registry/roc/button";
import { Badge } from "../registry/roc/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "../registry/roc/card";
import { Input } from "../registry/roc/input";
import { Textarea } from "../registry/roc/textarea";
import { Checkbox } from "../registry/roc/checkbox";
import { Switch } from "../registry/roc/switch";
import { Slider } from "../registry/roc/slider";
import { Separator } from "../registry/roc/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../registry/roc/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../registry/roc/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../registry/roc/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "../registry/roc/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../registry/roc/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../registry/roc/tooltip";

export function FoundationExample({ id }: { id: string }) {
  const [checked, setChecked] = useState(true),
    [amount, setAmount] = useState([42]),
    [text, setText] = useState("An afternoon worth keeping"),
    [action, setAction] = useState(""),
    [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  if (id === "button")
    return (
      <div className="foundation-demo">
        <div className="foundation-row">
          <Button
            pending={pending}
            pendingLabel="Saving…"
            onClick={() => {
              setPending(true);
              timer.current = setTimeout(() => {
                setPending(false);
                setAction("Saved locally for this demo");
              }, 1400);
            }}
          >
            Save changes
          </Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">More</Button>
        </div>
        <span className="foundation-hint" role="status">
          {action || "Feedback keeps its place."}
        </span>
      </div>
    );
  if (id === "badge")
    return (
      <div className="foundation-row">
        <Badge>Published</Badge>
        <Badge variant="secondary">In progress</Badge>
        <Badge variant="outline">Draft</Badge>
        <Badge variant="destructive">Needs attention</Badge>
      </div>
    );
  if (id === "card")
    return (
      <Card>
        <CardHeader>
          <CardTitle>Field notes</CardTitle>
          <CardDescription>
            A small place for an unfinished thought.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Draft</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Textarea
            aria-label="Card draft"
            defaultValue="There was still light at the window."
          />
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAction("Draft kept here")}
          >
            Keep draft
          </Button>
          <span className="foundation-hint" role="status">
            {action}
          </span>
        </CardFooter>
      </Card>
    );
  if (id === "input")
    return (
      <div className="foundation-demo">
        <label className="foundation-field">
          Title
          <Input defaultValue="Small observations" />
        </label>
        <label className="foundation-field">
          Email
          <Input type="email" placeholder="you@example.com" />
        </label>
      </div>
    );
  if (id === "textarea")
    return (
      <label className="foundation-field">
        A thought to return to
        <Textarea value={text} onChange={(e) => setText(e.target.value)} />
        <span className="foundation-hint">
          {text.length} characters · resize the preview, keep writing
        </span>
      </label>
    );
  if (id === "checkbox")
    return (
      <div className="foundation-demo">
        <label className="foundation-choice">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          Keep original sources
        </label>
        <label className="foundation-choice">
          <Checkbox defaultChecked="indeterminate" />
          Some items selected
        </label>
        <label className="foundation-choice">
          <Checkbox disabled />
          Unavailable option
        </label>
      </div>
    );
  if (id === "switch")
    return (
      <div className="foundation-demo">
        <label className="foundation-choice">
          <Switch checked={checked} onCheckedChange={setChecked} />
          Show annotations
        </label>
        <span className="foundation-hint">
          The same thumb follows each reversal.
        </span>
      </div>
    );
  if (id === "slider")
    return (
      <div className="foundation-demo">
        <div className="foundation-label">
          Reading width <output>{amount[0]}%</output>
        </div>
        <Slider
          aria-label="Reading width"
          value={amount}
          onValueChange={setAmount}
        />
        <span className="foundation-hint">
          Drag directly. Arrow keys refine.
        </span>
      </div>
    );
  if (id === "separator")
    return (
      <div className="foundation-demo">
        <span>Structure without another container.</span>
        <Separator />
        <div className="foundation-row">
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Sources</span>
          <Separator orientation="vertical" />
          <span>History</span>
        </div>
      </div>
    );
  if (id === "tabs")
    return (
      <Tabs defaultValue="write">
        <TabsList aria-label="Document views">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <label className="foundation-field">
            Working draft
            <Textarea
              aria-label="Tabs draft"
              defaultValue="Write here. Switch views. Return to the same draft."
            />
          </label>
        </TabsContent>
        <TabsContent value="details">
          <div className="foundation-demo">
            <Badge variant="outline">Local draft</Badge>
            <p>Your writing remains mounted while this view is active.</p>
            <label className="foundation-choice">
              <Switch defaultChecked />
              Keep annotations
            </label>
          </div>
        </TabsContent>
      </Tabs>
    );
  if (id === "accordion")
    return (
      <Accordion type="single" defaultValue="draft" collapsible>
        <AccordionItem value="draft">
          <AccordionTrigger>A note in progress</AccordionTrigger>
          <AccordionContent>
            <Textarea
              aria-label="Accordion draft"
              defaultValue="Fold this away, then pick up where you left off."
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="continuity">
          <AccordionTrigger>What stays when it folds?</AccordionTrigger>
          <AccordionContent>
            The original editor and its draft. Hidden content cannot receive
            focus.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  if (id === "dialog")
    return (
      <div className="foundation-demo">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document details</DialogTitle>
              <DialogDescription>
                Try Desktop and Phone while this is open. The same form changes
                its arrangement.
              </DialogDescription>
            </DialogHeader>
            <label className="foundation-field">
              Document title
              <Input
                aria-label="Dialog document title"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <label className="foundation-field">
              Notes
              <Textarea
                aria-label="Dialog notes"
                defaultValue="This input stays mounted through a viewport change."
              />
            </label>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <span className="foundation-hint">
          One form, centred or bottom-aligned.
        </span>
      </div>
    );
  if (id === "popover")
    return (
      <div className="foundation-demo">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">View options</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>View options</PopoverTitle>
              <PopoverDescription>
                Settings stay attached to their trigger.
              </PopoverDescription>
            </PopoverHeader>
            <div className="foundation-demo">
              <label className="foundation-choice">
                <Switch checked={checked} onCheckedChange={setChecked} />
                Annotations
              </label>
              <label className="foundation-field">
                Display name
                <Input
                  aria-label="Popover display name"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
            </div>
          </PopoverContent>
        </Popover>
        <span className="foundation-hint">Collision-aware placement.</span>
      </div>
    );
  if (id === "dropdown-menu")
    return (
      <div className="foundation-demo">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Document actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Document</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => setAction("Rename selected")}>
              Rename<DropdownMenuShortcut>↵</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setAction("Moved to Notes")}>
                  Notes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setAction("Moved to Archive")}
                >
                  Archive
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            >
              Show annotations
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem disabled>Share link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span role="status" className="foundation-hint">
          {action || "Keyboard, focus return and nested actions."}
        </span>
      </div>
    );
  if (id === "tooltip")
    return (
      <TooltipProvider>
        <div className="foundation-demo">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Keep original</Button>
            </TooltipTrigger>
            <TooltipContent>Preserve the source and its place.</TooltipContent>
          </Tooltip>
          <span className="foundation-hint">
            Supplemental context on hover or focus.
          </span>
        </div>
      </TooltipProvider>
    );
  return <MoreFoundationExample id={id} />;
}
