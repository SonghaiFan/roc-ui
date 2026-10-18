import { useState, useId, type CSSProperties, type ReactNode } from "react";
import {
  FileText,
  Search,
  Check,
  Plus,
  Minus,
  Mail,
  ArrowUpRight,
  Home,
  Folder,
  Settings,
  Clock,
} from "lucide-react";
import { Button } from "../registry/roc/button";
import { Slider } from "../registry/roc/slider";
import * as Edge from "../registry/roc/edge-panel";
import { Input } from "../registry/roc/input";
import { Textarea } from "../registry/roc/textarea";
import * as A from "../registry/roc/alert-dialog";
import { AspectRatio } from "../registry/roc/aspect-ratio";
import * as Attachment from "../registry/roc/attachment";
import * as Bubble from "../registry/roc/bubble";
import { ButtonGroup } from "../registry/roc/button-group";
import { Calendar } from "../registry/roc/calendar";
import * as Carousel from "../registry/roc/carousel";
import * as Chart from "../registry/roc/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import * as Code from "../registry/roc/code-block";
import * as Collapse from "../registry/roc/collapsible";
import * as Combo from "../registry/roc/combobox";
import * as Command from "../registry/roc/command";
import * as Context from "../registry/roc/context-menu";
import { DataTable } from "../registry/roc/data-table";
import { DatePicker } from "../registry/roc/date-picker";
import { DirectionProvider } from "../registry/roc/direction";
import * as Drawer from "../registry/roc/drawer";
import * as Empty from "../registry/roc/empty";
import * as Field from "../registry/roc/field";
import * as Hover from "../registry/roc/hover-card";
import * as Group from "../registry/roc/input-group";
import * as OTP from "../registry/roc/input-otp";
import * as Item from "../registry/roc/item";
import { Kbd, KbdGroup } from "../registry/roc/kbd";
import { Label } from "../registry/roc/label";
import * as Marker from "../registry/roc/marker";
import * as Menubar from "../registry/roc/menubar";
import * as Message from "../registry/roc/message";
import * as Scroller from "../registry/roc/message-scroller";
import {
  NativeSelect,
  NativeSelectOption,
} from "../registry/roc/native-select";
import * as Nav from "../registry/roc/navigation-menu";
import * as Q from "../registry/roc/questionnaire";
import * as Resize from "../registry/roc/resizable";
import * as Select from "../registry/roc/select";
import * as Sheet from "../registry/roc/sheet";
import * as Sidebar from "../registry/roc/sidebar";
import { Spinner } from "../registry/roc/spinner";
import * as Table from "../registry/roc/table";
import { Toaster, toast } from "../registry/roc/toast";
import * as Trace from "../registry/roc/trace";
import * as Type from "../registry/roc/typography";
const stack = { display: "grid", gap: 14, minWidth: 0 } as const;
const row = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
} as const;
const note = {
  fontSize: 12,
  color: "#777",
  margin: 0,
  lineHeight: 1.6,
} as const;
const panel = {
  padding: 18,
  background: "#f7f7f7",
  borderRadius: 8,
  minWidth: 0,
} as const;
const languages = ["React", "Vue", "Svelte", "Angular"];
const records = [
  { id: "a", name: "Field notes", status: "Draft" },
  { id: "b", name: "Walking routes", status: "Published" },
  { id: "c", name: "Collected ideas", status: "Draft" },
  { id: "d", name: "Morning light", status: "Published" },
  { id: "e", name: "Quiet spaces", status: "Review" },
  { id: "f", name: "Small rituals", status: "Review" },
];
const columns = [
  { accessorKey: "name", header: "Collection" },
  { accessorKey: "status", header: "Status" },
];
const art = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e7e5e0"/><circle cx="490" cy="85" r="35" fill="#fcfaf6"/><path d="M0 290L180 100L350 290L470 150L640 320V360H0Z" fill="#aaa9a1"/><path d="M0 330L180 190L350 350L470 250L640 360H0Z" fill="#777a71"/></svg>')}`;
function AlertDialogDemo() {
  const [done, setDone] = useState(false);
  return (
    <div style={stack}>
      <A.AlertDialog>
        <A.AlertDialogTrigger asChild>
          <Button variant="outline">Archive collection</Button>
        </A.AlertDialogTrigger>
        <A.AlertDialogContent>
          <A.AlertDialogHeader>
            <A.AlertDialogTitle>Archive this collection?</A.AlertDialogTitle>
            <A.AlertDialogDescription>
              You can restore it from the archive at any time.
            </A.AlertDialogDescription>
          </A.AlertDialogHeader>
          <A.AlertDialogFooter>
            <A.AlertDialogCancel>Cancel</A.AlertDialogCancel>
            <A.AlertDialogAction onClick={() => setDone(true)}>
              Archive
            </A.AlertDialogAction>
          </A.AlertDialogFooter>
        </A.AlertDialogContent>
      </A.AlertDialog>
      <p role="status" style={note}>
        {done
          ? "Collection archived in this preview."
          : "Confirm an action without losing context."}
      </p>
    </div>
  );
}
function AttachmentDemo() {
  const [state, setState] = useState<"done" | "uploading">("done");
  return (
    <div style={stack}>
      <Attachment.Attachment state={state}>
        <Attachment.AttachmentMedia>
          <FileText />
        </Attachment.AttachmentMedia>
        <Attachment.AttachmentContent>
          <Attachment.AttachmentTitle>
            Field notes.pdf
          </Attachment.AttachmentTitle>
          <Attachment.AttachmentDescription>
            {state === "done" ? "PDF · 2.4 MB" : "Uploading…"}
          </Attachment.AttachmentDescription>
        </Attachment.AttachmentContent>
      </Attachment.Attachment>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setState(state === "done" ? "uploading" : "done")}
      >
        {state === "done" ? "Preview upload" : "Finish upload"}
      </Button>
    </div>
  );
}
function ButtonGroupDemo() {
  const [count, setCount] = useState(3);
  return (
    <div style={stack}>
      <ButtonGroup aria-label="Quantity">
        <Button
          variant="outline"
          size="icon"
          aria-label="Decrease quantity"
          disabled={count === 0}
          onClick={() => setCount(count - 1)}
        >
          <Minus />
        </Button>
        <Button
          variant="outline"
          aria-label={`Quantity ${count}`}
          style={{ minWidth: 56 }}
        >
          {count}
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Increase quantity"
          onClick={() => setCount(count + 1)}
        >
          <Plus />
        </Button>
      </ButtonGroup>
      <p style={note}>Related actions keep a shared footprint.</p>
    </div>
  );
}
function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 18));
  return (
    <div style={{ ...stack, justifyItems: "center" }}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 9, 1)}
      />
      <p style={note} role="status">
        {date?.toLocaleDateString(undefined, { dateStyle: "medium" }) ??
          "Choose a day"}
      </p>
    </div>
  );
}
function CarouselDemo() {
  return (
    <div style={{ padding: "0 30px" }}>
      <Carousel.Carousel aria-label="Collection cards">
        <Carousel.CarouselContent>
          {["Observe", "Collect", "Reflect"].map((name, i) => (
            <Carousel.CarouselItem key={name}>
              <div
                style={{
                  ...panel,
                  minHeight: 160,
                  display: "grid",
                  placeContent: "center",
                  textAlign: "center",
                }}
              >
                <span style={note}>0{i + 1}</span>
                <h3>{name}</h3>
              </div>
            </Carousel.CarouselItem>
          ))}
        </Carousel.CarouselContent>
        <Carousel.CarouselPrevious
          style={{ left: -30, width: 26, height: 26 }}
        />
        <Carousel.CarouselNext style={{ right: -30, width: 26, height: 26 }} />
      </Carousel.Carousel>
    </div>
  );
}
function ChartDemo() {
  return (
    <Chart.ChartContainer
      config={{ notes: { label: "Notes", color: "#737373" } }}
      style={{ height: 190, width: "100%", aspectRatio: "auto" }}
    >
      <BarChart
        accessibilityLayer
        data={[
          { day: "Mon", notes: 12 },
          { day: "Tue", notes: 18 },
          { day: "Wed", notes: 9 },
          { day: "Thu", notes: 24 },
          { day: "Fri", notes: 16 },
        ]}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <Chart.ChartTooltip content={<Chart.ChartTooltipContent />} />
        <Bar
          dataKey="notes"
          fill="var(--color-notes)"
          radius={3}
          isAnimationActive={false}
        />
      </BarChart>
    </Chart.ChartContainer>
  );
}
function CodeDemo() {
  const code = '<Button variant="outline">\n  Keep the original\n</Button>';
  return (
    <Code.CodeBlock>
      <Code.CodeBlockHeader>
        <Code.CodeBlockTitle>example.tsx</Code.CodeBlockTitle>
        <Code.CodeBlockActions>
          <Code.CodeBlockCopyButton value={code} />
        </Code.CodeBlockActions>
      </Code.CodeBlockHeader>
      <Code.CodeBlockContent lineNumbers>{code}</Code.CodeBlockContent>
    </Code.CodeBlock>
  );
}
function CollapsibleDemo() {
  return (
    <Collapse.Collapsible defaultOpen>
      <Collapse.CollapsibleTrigger asChild>
        <Button variant="ghost" style={{ marginBottom: 10 }}>
          Collection details
        </Button>
      </Collapse.CollapsibleTrigger>
      <Collapse.CollapsibleContent>
        <Textarea
          aria-label="Collapsible draft"
          defaultValue="Keep this draft when folded."
        />
      </Collapse.CollapsibleContent>
    </Collapse.Collapsible>
  );
}
function ComboboxDemo() {
  return (
    <Combo.Combobox items={languages} defaultValue="React">
      <Combo.ComboboxInput
        aria-label="Framework"
        placeholder="Choose a framework"
        showClear
      />
      <Combo.ComboboxContent>
        <Combo.ComboboxEmpty>No frameworks found.</Combo.ComboboxEmpty>
        <Combo.ComboboxList>
          {(item: string) => (
            <Combo.ComboboxItem key={item} value={item}>
              {item}
            </Combo.ComboboxItem>
          )}
        </Combo.ComboboxList>
      </Combo.ComboboxContent>
    </Combo.Combobox>
  );
}
function CommandDemo() {
  const [action, setAction] = useState("");
  return (
    <div style={stack}>
      <Command.Command style={{ border: "1px solid #e5e5e5", borderRadius: 8 }}>
        <Command.CommandInput placeholder="Search actions…" />
        <Command.CommandList style={{ height: 150 }}>
          <Command.CommandEmpty>No matching actions.</Command.CommandEmpty>
          <Command.CommandGroup heading="Workspace">
            {["Open collection", "Create a note", "Search sources"].map(
              (text) => (
                <Command.CommandItem
                  key={text}
                  onSelect={() => setAction(text)}
                >
                  <FileText />
                  {text}
                </Command.CommandItem>
              ),
            )}
          </Command.CommandGroup>
        </Command.CommandList>
      </Command.Command>
      <p role="status" style={note}>
        {action || "Type to filter. Arrow keys to navigate."}
      </p>
    </div>
  );
}
function ContextDemo() {
  const [action, setAction] = useState("");
  return (
    <div style={stack}>
      <Context.ContextMenu>
        <Context.ContextMenuTrigger>
          <div
            style={{
              ...panel,
              textAlign: "center",
              padding: 30,
              border: "1px dashed #ddd",
            }}
          >
            Right-click or long-press
          </div>
        </Context.ContextMenuTrigger>
        <Context.ContextMenuContent>
          {["Open", "Duplicate", "Archive"].map((text) => (
            <Context.ContextMenuItem
              key={text}
              onSelect={() => setAction(text)}
            >
              {text}
            </Context.ContextMenuItem>
          ))}
        </Context.ContextMenuContent>
      </Context.ContextMenu>
      <p role="status" style={note}>
        {action || "Actions belong to this collection."}
      </p>
    </div>
  );
}
function DirectionDemo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  return (
    <div style={stack}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDir(dir === "ltr" ? "rtl" : "ltr")}
      >
        Switch to {dir === "ltr" ? "RTL" : "LTR"}
      </Button>
      <DirectionProvider dir={dir}>
        <div dir={dir} style={panel}>
          <Label htmlFor="direction-demo">
            {dir === "rtl" ? "عنوان المجموعة" : "Collection title"}
          </Label>
          <Input
            id="direction-demo"
            aria-label="Direction draft"
            defaultValue="Field notes"
            style={{ marginTop: 8 }}
          />
        </div>
      </DirectionProvider>
    </div>
  );
}
function DrawerDemo() {
  const [text, setText] = useState("A quiet place for ideas.");
  return (
    <Drawer.Drawer>
      <Drawer.DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </Drawer.DrawerTrigger>
      <Drawer.DrawerContent>
        <div
          style={{ maxWidth: 440, width: "100%", margin: "auto", padding: 20 }}
        >
          <Drawer.DrawerHeader>
            <Drawer.DrawerTitle>Collection note</Drawer.DrawerTitle>
            <Drawer.DrawerDescription>
              Drag the handle to dismiss.
            </Drawer.DrawerDescription>
          </Drawer.DrawerHeader>
          <Textarea
            aria-label="Drawer note"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Drawer.DrawerFooter>
            <Drawer.DrawerClose asChild>
              <Button variant="outline">Done</Button>
            </Drawer.DrawerClose>
          </Drawer.DrawerFooter>
        </div>
      </Drawer.DrawerContent>
    </Drawer.Drawer>
  );
}
function EmptyDemo() {
  const [created, setCreated] = useState(false);
  return (
    <Empty.Empty>
      <Empty.EmptyHeader>
        <Empty.EmptyMedia variant="icon">
          <Folder />
        </Empty.EmptyMedia>
        <Empty.EmptyTitle>
          {created ? "Your first collection" : "No collections yet"}
        </Empty.EmptyTitle>
        <Empty.EmptyDescription>
          {created
            ? "Ready for your first observation."
            : "Create a place for things worth keeping."}
        </Empty.EmptyDescription>
      </Empty.EmptyHeader>
      <Empty.EmptyContent>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCreated(!created)}
        >
          {created ? "Reset preview" : "Create collection"}
        </Button>
      </Empty.EmptyContent>
    </Empty.Empty>
  );
}
function FieldDemo() {
  const id = useId();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !value.trim();
  return (
    <form
      style={stack}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field.Field data-invalid={invalid}>
        <Field.FieldLabel htmlFor={id}>Collection name</Field.FieldLabel>
        <Input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={invalid}
          aria-describedby={id + "-hint"}
        />
        <Field.FieldDescription id={id + "-hint"}>
          A short, memorable name.
        </Field.FieldDescription>
        {invalid && <Field.FieldError>A name is required.</Field.FieldError>}
      </Field.Field>
      <Button size="sm" variant="outline" type="submit">
        Save name
      </Button>
      {submitted && !invalid && (
        <p role="status" style={note}>
          Saved in this preview.
        </p>
      )}
    </form>
  );
}
function HoverDemo() {
  return (
    <Hover.HoverCard>
      <Hover.HoverCardTrigger asChild>
        <a
          href="#profile"
          onClick={(e) => e.preventDefault()}
          style={{
            color: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          Alex Morgan
        </a>
      </Hover.HoverCardTrigger>
      <Hover.HoverCardContent>
        <strong>Alex Morgan</strong>
        <p style={note}>Designer, observer, collector of small things.</p>
      </Hover.HoverCardContent>
    </Hover.HoverCard>
  );
}
function InputGroupDemo() {
  const [value, setValue] = useState("");
  return (
    <div style={stack}>
      <Group.InputGroup>
        <Group.InputGroupAddon>
          <Search />
        </Group.InputGroupAddon>
        <Group.InputGroupInput
          aria-label="Search collections"
          placeholder="Search collections…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Group.InputGroupAddon align="inline-end">
          <Group.InputGroupText>{value.length}/40</Group.InputGroupText>
        </Group.InputGroupAddon>
      </Group.InputGroup>
      <Group.InputGroup>
        <Group.InputGroupAddon>
          <Mail />
        </Group.InputGroupAddon>
        <Group.InputGroupInput
          aria-label="Email address"
          type="email"
          placeholder="you@example.com"
        />
      </Group.InputGroup>
    </div>
  );
}
function OTPDemo() {
  const [value, setValue] = useState("");
  return (
    <div style={stack}>
      <OTP.InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        aria-label="Verification code"
      >
        <OTP.InputOTPGroup>
          {[0, 1, 2].map((i) => (
            <OTP.InputOTPSlot key={i} index={i} />
          ))}
        </OTP.InputOTPGroup>
        <OTP.InputOTPSeparator />
        <OTP.InputOTPGroup>
          {[3, 4, 5].map((i) => (
            <OTP.InputOTPSlot key={i} index={i} />
          ))}
        </OTP.InputOTPGroup>
      </OTP.InputOTP>
      <p role="status" style={note}>
        {value.length === 6
          ? "Code complete. Preview only."
          : "Enter a six-digit code."}
      </p>
    </div>
  );
}
function ItemDemo() {
  const [kept, setKept] = useState(false);
  return (
    <Item.Item variant="outline">
      <Item.ItemMedia variant="icon">
        <FileText />
      </Item.ItemMedia>
      <Item.ItemContent>
        <Item.ItemTitle>Morning observations</Item.ItemTitle>
        <Item.ItemDescription>A note from the collection.</Item.ItemDescription>
      </Item.ItemContent>
      <Item.ItemActions>
        <Button
          size="sm"
          variant="outline"
          aria-pressed={kept}
          onClick={() => setKept(!kept)}
        >
          {kept ? "Kept" : "Keep"}
        </Button>
      </Item.ItemActions>
    </Item.Item>
  );
}
function LabelDemo() {
  const id = useId();
  return (
    <div style={stack}>
      <Label htmlFor={id}>Display name</Label>
      <Input id={id} defaultValue="Alex Morgan" />
      <p style={note}>Clicking the label focuses its field.</p>
    </div>
  );
}
function MenubarDemo() {
  const [action, setAction] = useState("");
  return (
    <div style={stack}>
      <Menubar.Menubar>
        {["File", "Edit", "View"].map((menu) => (
          <Menubar.MenubarMenu key={menu}>
            <Menubar.MenubarTrigger>{menu}</Menubar.MenubarTrigger>
            <Menubar.MenubarContent>
              {(menu === "File"
                ? ["New note", "Open collection"]
                : menu === "Edit"
                  ? ["Undo", "Find"]
                  : ["Reading view", "Grid view"]
              ).map((text) => (
                <Menubar.MenubarItem
                  key={text}
                  onSelect={() => setAction(text)}
                >
                  {text}
                </Menubar.MenubarItem>
              ))}
            </Menubar.MenubarContent>
          </Menubar.MenubarMenu>
        ))}
      </Menubar.Menubar>
      <p role="status" style={note}>
        {action || "A keyboard-friendly action bar."}
      </p>
    </div>
  );
}
function MessageDemo() {
  return (
    <Message.MessageGroup>
      <Message.Message>
        <Message.MessageContent>
          <Message.MessageHeader>Alex</Message.MessageHeader>
          <Bubble.Bubble variant="secondary">
            <Bubble.BubbleContent>
              Keep the context beside the work.
            </Bubble.BubbleContent>
          </Bubble.Bubble>
          <Message.MessageFooter>10:24</Message.MessageFooter>
        </Message.MessageContent>
      </Message.Message>
      <Message.Message align="end">
        <Message.MessageContent>
          <Bubble.Bubble variant="outline">
            <Bubble.BubbleContent>
              And return to the same thought.
            </Bubble.BubbleContent>
          </Bubble.Bubble>
          <Message.MessageFooter>You · 10:25</Message.MessageFooter>
        </Message.MessageContent>
      </Message.Message>
    </Message.MessageGroup>
  );
}
function ScrollerDemo() {
  const [count, setCount] = useState(5);
  return (
    <div style={stack}>
      <Scroller.MessageScrollerProvider defaultScrollPosition="start">
        <Scroller.MessageScroller
          style={{ height: 200, border: "1px solid #eee", borderRadius: 8 }}
        >
          <Scroller.MessageScrollerViewport>
            <Scroller.MessageScrollerContent style={{ padding: 12, gap: 14 }}>
              {Array.from({ length: count }, (_, i) => (
                <Scroller.MessageScrollerItem key={i} messageId={String(i)}>
                  <Bubble.Bubble variant="secondary">
                    <Bubble.BubbleContent>
                      Observation {i + 1}: a thought worth keeping.
                    </Bubble.BubbleContent>
                  </Bubble.Bubble>
                </Scroller.MessageScrollerItem>
              ))}
            </Scroller.MessageScrollerContent>
          </Scroller.MessageScrollerViewport>
          <Scroller.MessageScrollerButton />
        </Scroller.MessageScroller>
      </Scroller.MessageScrollerProvider>
      <Button variant="outline" size="sm" onClick={() => setCount(count + 1)}>
        Add message
      </Button>
    </div>
  );
}
function NativeSelectDemo() {
  const [value, setValue] = useState("private");
  return (
    <div style={stack}>
      <NativeSelect
        aria-label="Visibility"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <NativeSelectOption value="private">Only me</NativeSelectOption>
        <NativeSelectOption value="team">Workspace</NativeSelectOption>
        <NativeSelectOption value="public">Public</NativeSelectOption>
      </NativeSelect>
      <p role="status" style={note}>
        Visibility: {value}
      </p>
    </div>
  );
}
function NavigationDemo() {
  const [selected, setSelected] = useState("Overview");
  return (
    <div style={stack}>
      <Nav.NavigationMenu viewport={false}>
        <Nav.NavigationMenuList>
          <Nav.NavigationMenuItem>
            <Nav.NavigationMenuTrigger>Workspace</Nav.NavigationMenuTrigger>
            <Nav.NavigationMenuContent style={{ width: 190 }}>
              {["Overview", "Collections", "Settings"].map((name) => (
                <Nav.NavigationMenuLink key={name} asChild>
                  <button onClick={() => setSelected(name)}>{name}</button>
                </Nav.NavigationMenuLink>
              ))}
            </Nav.NavigationMenuContent>
          </Nav.NavigationMenuItem>
          <Nav.NavigationMenuItem>
            <Nav.NavigationMenuLink asChild>
              <button onClick={() => setSelected("Guide")}>Guide</button>
            </Nav.NavigationMenuLink>
          </Nav.NavigationMenuItem>
        </Nav.NavigationMenuList>
      </Nav.NavigationMenu>
      <p role="status" style={note}>
        Current: {selected}
      </p>
    </div>
  );
}
function QuestionnaireDemo() {
  const [done, setDone] = useState(false);
  return (
    <div style={{ ...stack, minHeight: 255 }}>
      <Q.Questionnaire
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <Q.QuestionnaireProgress />
        <Q.QuestionnaireItem name="purpose" required>
          <Q.QuestionnaireTitle>What are you collecting?</Q.QuestionnaireTitle>
          <Q.QuestionnaireChoices>
            <Q.QuestionnaireChoice value="ideas">Ideas</Q.QuestionnaireChoice>
            <Q.QuestionnaireChoice value="research">
              Research
            </Q.QuestionnaireChoice>
          </Q.QuestionnaireChoices>
        </Q.QuestionnaireItem>
        <Q.QuestionnaireItem name="title" required>
          <Q.QuestionnaireTitle>Name your collection</Q.QuestionnaireTitle>
          <Q.QuestionnaireInput
            aria-label="Questionnaire collection name"
            placeholder="Field notes"
          />
        </Q.QuestionnaireItem>
        <Q.QuestionnaireActions>
          <Q.QuestionnairePrevious />
          <Q.QuestionnaireNext />
          <Q.QuestionnaireSubmit />
        </Q.QuestionnaireActions>
      </Q.Questionnaire>
      <p style={note} role="status">
        {done
          ? "Answers saved in this preview."
          : "Your answers stay when you go back."}
      </p>
    </div>
  );
}
function ResizableDemo() {
  return (
    <Resize.ResizablePanelGroup
      orientation="horizontal"
      style={{ height: 190, border: "1px solid #e5e5e5", borderRadius: 8 }}
    >
      <Resize.ResizablePanel defaultSize="40%" minSize="25%">
        <div style={{ padding: 12 }}>
          Sources<p style={note}>Drag the divider.</p>
        </div>
      </Resize.ResizablePanel>
      <Resize.ResizableHandle withHandle />
      <Resize.ResizablePanel defaultSize="60%" minSize="25%">
        <div style={{ padding: 12 }}>
          <Textarea
            aria-label="Resizable draft"
            defaultValue="Same editor, more room."
          />
        </div>
      </Resize.ResizablePanel>
    </Resize.ResizablePanelGroup>
  );
}
function SelectDemo() {
  return (
    <Select.Select defaultValue="private">
      <Select.SelectTrigger aria-label="Sharing">
        <Select.SelectValue placeholder="Choose visibility" />
      </Select.SelectTrigger>
      <Select.SelectContent>
        <Select.SelectGroup>
          <Select.SelectLabel>Sharing</Select.SelectLabel>
          <Select.SelectItem value="private">Only me</Select.SelectItem>
          <Select.SelectItem value="team">Workspace</Select.SelectItem>
          <Select.SelectItem value="public">Public link</Select.SelectItem>
        </Select.SelectGroup>
      </Select.SelectContent>
    </Select.Select>
  );
}
function EdgePanelDemo() {
  const [accent, setAccent] = useState([40]);
  return (
    <Edge.EdgePanel contained>
      <div
        style={{ position: "relative", minHeight: 240, padding: "0 0 0 16px" }}
      >
        <Textarea
          aria-label="Edge panel canvas"
          defaultValue="Move the pointer to the left edge of this box."
          style={{ minHeight: 200 }}
        />
        <Edge.EdgePanelTrigger asChild>
          <Button variant="ghost" size="sm" style={{ marginTop: 8 }}>
            Style
          </Button>
        </Edge.EdgePanelTrigger>
        <Edge.EdgePanelContent
          title="Appearance"
          style={{ "--roc-edge-panel-width": "190px" } as CSSProperties}
        >
          <div style={{ display: "grid", gap: 10, padding: 14 }}>
            <Label style={{ fontSize: 11 }}>
              Accent
              <Slider
                aria-label="Edge accent"
                min={0}
                max={100}
                value={accent}
                onValueChange={setAccent}
              />
            </Label>
          </div>
        </Edge.EdgePanelContent>
      </div>
    </Edge.EdgePanel>
  );
}
function SheetDemo() {
  const [value, setValue] = useState("Field notes");
  return (
    <Sheet.Sheet>
      <Sheet.SheetTrigger asChild>
        <Button variant="outline">Open inspector</Button>
      </Sheet.SheetTrigger>
      <Sheet.SheetContent>
        <Sheet.SheetHeader>
          <Sheet.SheetTitle>Collection settings</Sheet.SheetTitle>
          <Sheet.SheetDescription>
            Changes stay with this collection.
          </Sheet.SheetDescription>
        </Sheet.SheetHeader>
        <div style={{ padding: 20 }}>
          <Input
            aria-label="Sheet title"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Sheet.SheetFooter>
          <Sheet.SheetClose asChild>
            <Button>Done</Button>
          </Sheet.SheetClose>
        </Sheet.SheetFooter>
      </Sheet.SheetContent>
    </Sheet.Sheet>
  );
}
function SidebarDemo() {
  const [page, setPage] = useState("Home");
  return (
    <Sidebar.SidebarProvider style={{ minHeight: 220 }}>
      <Sidebar.Sidebar aria-label="Workspace sidebar">
        <Sidebar.SidebarHeader>
          <strong>Workspace</strong>
        </Sidebar.SidebarHeader>
        <Sidebar.SidebarContent>
          <Sidebar.SidebarMenu>
            {[
              ["Home", Home],
              ["Collections", Folder],
              ["Settings", Settings],
            ].map(([name, Icon]) => {
              const I = Icon as typeof Home;
              return (
                <Sidebar.SidebarMenuItem key={String(name)}>
                  <Sidebar.SidebarMenuButton
                    isActive={page === name}
                    onClick={() => setPage(String(name))}
                  >
                    <I />
                    {String(name)}
                  </Sidebar.SidebarMenuButton>
                </Sidebar.SidebarMenuItem>
              );
            })}
          </Sidebar.SidebarMenu>
        </Sidebar.SidebarContent>
      </Sidebar.Sidebar>
      <Sidebar.SidebarInset>
        <Sidebar.SidebarTrigger />
        <p style={note}>{page}</p>
        <Textarea
          aria-label="Sidebar draft"
          defaultValue="Keep this thought."
          style={{ marginTop: 10 }}
        />
      </Sidebar.SidebarInset>
    </Sidebar.SidebarProvider>
  );
}
function SpinnerDemo() {
  const [busy, setBusy] = useState(true);
  return (
    <div style={stack}>
      <div style={{ ...row, minHeight: 32 }}>
        {busy ? <Spinner /> : <Check size={16} />}
        <span>{busy ? "Preparing collection…" : "Collection ready"}</span>
      </div>
      <Button size="sm" variant="outline" onClick={() => setBusy(!busy)}>
        {busy ? "Finish" : "Run again"}
      </Button>
    </div>
  );
}
function TableDemo() {
  return (
    <Table.Table>
      <Table.TableCaption>Recent collections</Table.TableCaption>
      <Table.TableHeader>
        <Table.TableRow>
          <Table.TableHead>Name</Table.TableHead>
          <Table.TableHead>Status</Table.TableHead>
        </Table.TableRow>
      </Table.TableHeader>
      <Table.TableBody>
        {records.slice(0, 3).map((item) => (
          <Table.TableRow key={item.id}>
            <Table.TableCell>{item.name}</Table.TableCell>
            <Table.TableCell>{item.status}</Table.TableCell>
          </Table.TableRow>
        ))}
      </Table.TableBody>
    </Table.Table>
  );
}
function ToastDemo() {
  return (
    <Toaster>
      <div style={stack}>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Collection saved",
              description: "Your changes are kept locally.",
              type: "success",
            })
          }
        >
          Show notification
        </Button>
        <p style={note}>Dismiss, swipe, or let it settle.</p>
      </div>
    </Toaster>
  );
}
function TraceDemo() {
  return (
    <Trace.Trace>
      <Trace.TraceLine>
        <Trace.TraceIcon>
          <Check />
        </Trace.TraceIcon>
        <Trace.TraceTitle>Read three sources</Trace.TraceTitle>
        <Trace.TraceDescription>0.8s</Trace.TraceDescription>
      </Trace.TraceLine>
      <Trace.TraceCollapsible>
        <Trace.TraceCollapsibleTrigger>
          <Trace.TraceLine>
            <Trace.TraceIcon>
              <FileText />
            </Trace.TraceIcon>
            <Trace.TraceTitle>Collected observations</Trace.TraceTitle>
          </Trace.TraceLine>
        </Trace.TraceCollapsibleTrigger>
        <Trace.TraceCollapsibleContent>
          <p style={note}>
            Three notes share a common theme: keep the original context.
          </p>
        </Trace.TraceCollapsibleContent>
      </Trace.TraceCollapsible>
      <Trace.TraceLine status="pending">
        <Trace.TraceIcon>
          <Clock />
        </Trace.TraceIcon>
        <Trace.TraceTitle>Ready for review</Trace.TraceTitle>
      </Trace.TraceLine>
    </Trace.Trace>
  );
}
const demos: Record<string, () => ReactNode> = {
  "alert-dialog": AlertDialogDemo,
  "aspect-ratio": () => (
    <AspectRatio ratio={16 / 9}>
      <img
        src={art}
        alt="Abstract mountain landscape"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
    </AspectRatio>
  ),
  attachment: AttachmentDemo,
  bubble: () => (
    <Bubble.BubbleGroup>
      <Bubble.Bubble variant="secondary">
        <Bubble.BubbleContent>
          A small thought, kept in its own space.
        </Bubble.BubbleContent>
      </Bubble.Bubble>
      <Bubble.Bubble variant="outline">
        <Bubble.BubbleContent>Room for a reply.</Bubble.BubbleContent>
      </Bubble.Bubble>
    </Bubble.BubbleGroup>
  ),
  "button-group": ButtonGroupDemo,
  calendar: CalendarDemo,
  carousel: CarouselDemo,
  chart: ChartDemo,
  "code-block": CodeDemo,
  collapsible: CollapsibleDemo,
  combobox: ComboboxDemo,
  command: CommandDemo,
  "context-menu": ContextDemo,
  "data-table": () => (
    <DataTable
      data={records}
      columns={columns}
      getRowId={(row) => row.id}
      pageSize={3}
      label="Collections"
    />
  ),
  "date-picker": () => <DatePicker defaultValue={new Date(2026, 9, 18)} />,
  direction: DirectionDemo,
  drawer: DrawerDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  "hover-card": HoverDemo,
  "input-group": InputGroupDemo,
  "input-otp": OTPDemo,
  item: ItemDemo,
  kbd: () => (
    <div style={row}>
      <span style={note}>Search anything</span>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  ),
  label: LabelDemo,
  marker: () => (
    <div style={stack}>
      <p style={note}>Earlier observations</p>
      <Marker.Marker variant="separator">
        <Marker.MarkerContent>Today</Marker.MarkerContent>
      </Marker.Marker>
      <p style={note}>A new chapter in the conversation.</p>
    </div>
  ),
  menubar: MenubarDemo,
  message: MessageDemo,
  "message-scroller": ScrollerDemo,
  "native-select": NativeSelectDemo,
  "navigation-menu": NavigationDemo,
  questionnaire: QuestionnaireDemo,
  resizable: ResizableDemo,
  select: SelectDemo,
  "edge-panel": EdgePanelDemo,
  sheet: SheetDemo,
  sidebar: SidebarDemo,
  spinner: SpinnerDemo,
  table: TableDemo,
  toast: ToastDemo,
  trace: TraceDemo,
  typography: () => (
    <Type.Typography>
      <Type.TypographyH2>Small observations</Type.TypographyH2>
      <Type.TypographyP>
        A clear hierarchy gives each thought enough room.
      </Type.TypographyP>
      <Type.TypographyBlockquote>
        Keep what matters. Let the rest be quiet.
      </Type.TypographyBlockquote>
      <Type.TypographyMuted>
        Built from the same primitives.
      </Type.TypographyMuted>
    </Type.Typography>
  ),
};
export const additionalIds = Object.keys(demos);
export function CatalogExample({ id }: { id: string }) {
  const Demo = demos[id];
  return Demo ? <Demo /> : null;
}
