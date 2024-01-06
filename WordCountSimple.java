import java.io.IOException;
import java.util.*;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.*;
import org.apache.hadoop.mapreduce.lib.output.*;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.fs.*;


public class WordCountSimple {

 public static class Map extends Mapper<LongWritable, Text, Text, IntWritable> {
        private final static IntWritable one = new IntWritable(1);
        private Text word = new Text();

         @Override
    public void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {
        // Obtén el índice del registro actual
        long lineNumber = key.get();

        // Si no es la primera línea (nombres de campos), procesamos
        if (lineNumber > 0) {
            String line = value.toString();

            // Eliminamos comillas dobles y reemplazamos espacios con comas
            line = line.replaceAll("\"", "").replaceAll(" ", ",");

            // Dividimos la línea en palabras usando la coma como separador
            String[] tokens = line.split(",");

            // Iteramos sobre los tokens y emitimos cada palabra (ignoramos los números)
            for (String token : tokens) {
                token = token.trim();
                if (!token.isEmpty() && !token.matches(".*\\d.*")) { // Verifica que no sea un número
                    word.set(token);
                    context.write(word, one);
                }
            }
        }
    }
}

public static class Reduce extends Reducer<Text, IntWritable, Text, IntWritable> {
		@Override
		public void reduce(Text key, Iterable<IntWritable> values, Context context)
				throws IOException, InterruptedException {
			int sum = 0;
			for (IntWritable val: values) {
				sum += val.get();
			}
			context.write(key, new IntWritable(sum));
		}

	}

public static void main(String[] args) throws Exception {
		Job job = Job.getInstance();
		job.setJarByClass(WordCountSimple.class);
		job.setJobName("WordCountSimple");

		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);

		job.setMapperClass(Map.class);
		job.setCombinerClass(Reduce.class);
		job.setReducerClass(Reduce.class);

		job.setInputFormatClass(TextInputFormat.class);
		job.setOutputFormatClass(TextOutputFormat.class);

		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));

		System.exit(job.waitForCompletion(true)? 0 : 1);
	}

}