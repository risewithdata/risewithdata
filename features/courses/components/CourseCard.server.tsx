type Props = {
  title: string;
  excerpt?: string;
};

export default function CourseCard({ title, excerpt }: Props) {
  return (
    <article>
      <h3>{title}</h3>
      {excerpt && <p>{excerpt}</p>}
    </article>
  );
}
